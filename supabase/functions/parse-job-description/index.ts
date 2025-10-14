import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const upstashUrl = Deno.env.get('UPSTASH_REDIS_REST_URL');
    const upstashToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');
    if (!upstashUrl || !upstashToken) {
      throw new Error('Rate limiting environment variables are not configured');
    }

    const rateLimitKey = `parse-job-description:${user.id}`;
    const rateLimitResponse = await fetch(`${upstashUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', rateLimitKey],
        ['EXPIRE', rateLimitKey, 60],
      ]),
    });

    if (!rateLimitResponse.ok) {
      console.error('Failed to enforce rate limit:', rateLimitResponse.status, await rateLimitResponse.text());
      throw new Error('Unable to enforce rate limit');
    }

    const rateLimitData = await rateLimitResponse.json();
    const requestCount = Array.isArray(rateLimitData?.result)
      ? Number(rateLimitData.result[0])
      : undefined;

    if (Number.isNaN(requestCount) || requestCount === undefined) {
      throw new Error('Unexpected rate limit response');
    }

    if (requestCount > 10) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait before retrying.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { jd_text } = await req.json();

    if (!jd_text || jd_text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Job description text is required and must be at least 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Parsing job description with AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a recruiting assistant that extracts structured data from job descriptions.

Extract the following information:
1. role_title: The exact job title (keep it concise, max 60 chars)
2. company_name: The company name (if mentioned, otherwise use "Company")
3. job_summary: A professional 2-3 sentence summary of the role
4. key_skills: Array of 5-7 most important required skills
5. experience_level: Years of experience required (e.g., "5+ years", "Mid-level", "Entry-level")

Return structured data with these exact fields.`
          },
          {
            role: 'user',
            content: `Extract structured data from this job description:\n\n${jd_text}`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_job_data',
              description: 'Extract structured data from job description',
              parameters: {
                type: 'object',
                properties: {
                  role_title: { 
                    type: 'string',
                    description: 'The job title, concise and professional'
                  },
                  company_name: { 
                    type: 'string',
                    description: 'The company name or "Company" if not found'
                  },
                  job_summary: { 
                    type: 'string',
                    description: 'A 2-3 sentence professional summary of the role'
                  },
                  key_skills: { 
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 5-7 most important required skills'
                  },
                  experience_level: { 
                    type: 'string',
                    description: 'Experience level required (e.g., "5+ years", "Mid-level")'
                  }
                },
                required: ['role_title', 'company_name', 'job_summary', 'key_skills', 'experience_level'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_job_data' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'extract_job_data') {
      throw new Error('AI did not return expected tool call');
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log('Extracted data:', extractedData);

    return new Response(
      JSON.stringify(extractedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-job-description:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to parse job description'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
