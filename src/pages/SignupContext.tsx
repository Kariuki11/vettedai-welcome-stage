import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const step2Schema = z.object({
  userRole: z.enum(['in_house', 'hiring_manager', 'founder', 'agency', 'other'], {
    required_error: "Please select your role"
  }),
  companySize: z.enum(['1-10', '11-50', '51-200', '201+'], {
    required_error: "Please select your company size"
  }),
  referralSource: z.enum(['linkedin', 'friend_colleague', 'antler', 'other']).optional()
});

type Step2FormData = z.infer<typeof step2Schema>;

interface Step1Data {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupContext = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  
  const { completeSignUp, trackSignupEvent } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateData = location.state?.step1Data;
    const sessionData = sessionStorage.getItem("signup.step1");
    
    if (stateData) {
      setStep1Data(stateData);
    } else if (sessionData) {
      try {
        setStep1Data(JSON.parse(sessionData));
      } catch {
        navigate("/signup");
      }
    } else {
      navigate("/signup");
    }
  }, [location, navigate]);

  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      userRole: undefined,
      companySize: undefined,
      referralSource: undefined,
    },
  });

  const onSubmit = async (data: Step2FormData) => {
    if (!step1Data) return;

    setIsSubmitting(true);
    
    try {
      await trackSignupEvent('signup_step_2_completed', undefined, {
        user_role: data.userRole,
        company_size: data.companySize,
        referral_source: data.referralSource
      });
      
      const { data: authData, error } = await completeSignUp(
        step1Data.email,
        step1Data.password,
        step1Data.fullName,
        step1Data.companyName,
        data.userRole,
        data.companySize,
        data.referralSource
      );
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      await trackSignupEvent('signup_completed', authData?.user?.id);
      
      sessionStorage.removeItem("signup.step1");
      
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/workspace');
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-lg p-12 shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Welcome to VettedAI!</h3>
                <p className="text-muted-foreground">
                  Your workspace is ready. Redirecting you now...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!step1Data) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">A Little More About You</h1>
          <p className="text-muted-foreground">This helps us tailor your VettedAI experience. Step 2 of 2</p>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What best describes your role? <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="in_house" id="in_house" />
                          <Label htmlFor="in_house" className="flex-1 cursor-pointer font-normal">
                            In-house Recruiter / Talent Acquisition
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="hiring_manager" id="hiring_manager" />
                          <Label htmlFor="hiring_manager" className="flex-1 cursor-pointer font-normal">
                            Hiring Manager
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="founder" id="founder" />
                          <Label htmlFor="founder" className="flex-1 cursor-pointer font-normal">
                            Founder / CEO
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="agency" id="agency" />
                          <Label htmlFor="agency" className="flex-1 cursor-pointer font-normal">
                            Agency / RPO Recruiter
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="other" id="role_other" />
                          <Label htmlFor="role_other" className="flex-1 cursor-pointer font-normal">
                            Other
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company size <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="1-10" id="size_1_10" />
                          <Label htmlFor="size_1_10" className="flex-1 cursor-pointer font-normal">
                            1-10 employees
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="11-50" id="size_11_50" />
                          <Label htmlFor="size_11_50" className="flex-1 cursor-pointer font-normal">
                            11-50 employees
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="51-200" id="size_51_200" />
                          <Label htmlFor="size_51_200" className="flex-1 cursor-pointer font-normal">
                            51-200 employees
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="201+" id="size_201_plus" />
                          <Label htmlFor="size_201_plus" className="flex-1 cursor-pointer font-normal">
                            201+ employees
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referralSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="friend_colleague">Friend / Colleague</SelectItem>
                        <SelectItem value="antler">Antler</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Workspace...
                  </>
                ) : (
                  "Create My Workspace"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupContext;
