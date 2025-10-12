import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdminRole(session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAdminRole(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId?: string) => {
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc('is_admin');
    setIsAdmin(data === true);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (!error && data.user) {
      // Create recruiter profile
      await supabase.from('recruiters').insert({
        user_id: data.user.id,
        email: email,
        full_name: fullName
      });
    }

    return { data, error };
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const createPendingRecruiter = async (email: string) => {
    // Check if recruiter already exists
    const { data: existing } = await supabase
      .from('recruiters')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    // If already exists, don't create duplicate
    if (existing) {
      return { data: existing, error: null };
    }

    // Create new pending recruiter
    const { data, error } = await supabase
      .from('recruiters')
      .insert({ 
        email, 
        status: 'pending_confirmation',
        full_name: '',
        created_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    return { data, error };
  };

  const completeSignUp = async (
    email: string, 
    password: string, 
    fullName: string,
    companyName: string,
    userRole: string,
    companySize: string,
    referralSource?: string
  ) => {
    // First, create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName
        },
        emailRedirectTo: `${window.location.origin}/workspace`
      }
    });

    if (authError || !authData.user) {
      return { data: null, error: authError };
    }

    // Then, update the pending recruiter record to active
    const { data: recruiterData, error: recruiterError } = await supabase
      .from('recruiters')
      .update({
        user_id: authData.user.id,
        full_name: fullName,
        company_name: companyName,
        user_role: userRole,
        company_size: companySize,
        referral_source: referralSource,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .maybeSingle();

    // If no existing record, create one
    if (recruiterError && recruiterError.code === 'PGRST116') {
      const { data: newRecruiter, error: insertError } = await supabase
        .from('recruiters')
        .insert({
          user_id: authData.user.id,
          email: email,
          full_name: fullName,
          company_name: companyName,
          user_role: userRole,
          company_size: companySize,
          referral_source: referralSource,
          status: 'active'
        })
        .select()
        .maybeSingle();
      
      return { data: authData, error: insertError };
    }

    return { data: authData, error: recruiterError };
  };

  const trackSignupEvent = async (eventType: string, userId?: string, metadata?: any) => {
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      user_id: userId,
      metadata: metadata,
      created_at: new Date().toISOString()
    });
  };

  return { 
    user, 
    isAdmin, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    createPendingRecruiter, 
    completeSignUp, 
    trackSignupEvent 
  };
};
