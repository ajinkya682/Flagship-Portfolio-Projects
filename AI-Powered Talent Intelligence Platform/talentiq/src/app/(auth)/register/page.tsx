"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";

const step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid work email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const step2Schema = z.object({
  companySize: z.string().min(1, "Please select your company size"),
  hearAbout: z.string().min(1, "Please select an option"),
});

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 Form
  const form1 = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
  });

  // Step 2 Form
  const form2 = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
  });

  // Watch password for strength meter
  const passwordValue = form1.watch("password", "");
  const hasMinLength = passwordValue.length >= 8;
  const hasNumber = /[0-9]/.test(passwordValue);

  const onStep1Submit = () => {
    setStep(2);
  };

  const onStep2Submit = async (data: z.infer<typeof step2Schema>) => {
    setIsSubmitting(true);
    try {
      const step1Data = form1.getValues();
      await registerUser({
        name: step1Data.name,
        companyName: step1Data.companyName,
        email: step1Data.email,
        password: step1Data.password,
      });
      window.location.href = "/dashboard";
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create account';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8 w-2/3">
        {step === 1 ? (
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[12px] font-bold">
            1
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
        <div className="flex gap-1 flex-1">
          <div
            className={`h-0.5 flex-1 ${step >= 1 ? "bg-blue-200" : "bg-neutral-200"}`}
          ></div>
          <div
            className={`h-0.5 flex-1 ${step >= 1 ? "bg-blue-200" : "bg-neutral-200"}`}
          ></div>
        </div>

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${step === 2 ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
        >
          2
        </div>

        {step === 2 && (
          <div className="flex gap-1 flex-1">
            <div className="h-0.5 flex-1 bg-neutral-200"></div>
            <div className="h-0.5 flex-1 bg-neutral-200"></div>
          </div>
        )}
      </div>

      <div className="text-left mb-[32px]">
        <h1 className="font-display text-[26px] font-bold text-neutral-900 leading-tight mb-2">
          {step === 1 ? "Create your account" : "Just a few more details"}
        </h1>
        <p className="font-body text-[14px] text-neutral-500 leading-relaxed">
          {step === 1
            ? "Start your 14-day free trial. No credit card required."
            : "Help us customize your workspace experience."}
        </p>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            type="button"
            className="w-full h-[48px] mb-6 flex items-center justify-center gap-3 bg-white border border-neutral-200 rounded-lg text-[15px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-neutral-200"></div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-neutral-200"></div>
          </div>

          <form
            onSubmit={form1.handleSubmit(onStep1Submit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[13px] font-bold text-neutral-800">
                Full Name
              </label>
              <input
                {...form1.register("name")}
                type="text"
                placeholder="Jane Doe"
                className="h-[44px] px-3 bg-white border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-neutral-400"
              />
              {form1.formState.errors.name && (
                <p className="text-[12px] text-red-500 mt-0.5">
                  {form1.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[13px] font-bold text-neutral-800">
                Company Name
              </label>
              <input
                {...form1.register("companyName")}
                type="text"
                placeholder="Acme Corp"
                className="h-[44px] px-3 bg-white border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-neutral-400"
              />
              {form1.formState.errors.companyName && (
                <p className="text-[12px] text-red-500 mt-0.5">
                  {form1.formState.errors.companyName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[13px] font-bold text-neutral-800">
                Work Email
              </label>
              <input
                {...form1.register("email")}
                type="email"
                placeholder="jane@acme.com"
                className="h-[44px] px-3 bg-white border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-neutral-400"
              />
              {form1.formState.errors.email && (
                <p className="text-[12px] text-red-500 mt-0.5">
                  {form1.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[13px] font-bold text-neutral-800">
                Password
              </label>
              <div className="relative">
                <input
                  {...form1.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••"
                  className="w-full h-[44px] pl-3 pr-10 bg-neutral-50/50 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[12px] text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password Strength */}
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className={
                      hasMinLength ? "text-emerald-500" : "text-neutral-300"
                    }
                  />
                  <span
                    className={`text-[12px] ${hasMinLength ? "text-neutral-700" : "text-neutral-500"}`}
                  >
                    8+ characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className={
                      hasNumber ? "text-emerald-500" : "text-neutral-300"
                    }
                  />
                  <span
                    className={`text-[12px] ${hasNumber ? "text-neutral-700" : "text-neutral-500"}`}
                  >
                    At least 1 number
                  </span>
                </div>
              </div>
              {form1.formState.errors.password && (
                <p className="text-[12px] text-red-500 mt-0.5">
                  {form1.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-4 w-full h-[48px] bg-[#1D4ED8] hover:bg-blue-800 text-white font-body text-[15px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Continue to step 2 <ArrowRight className="w-4 h-4" />
            </button>

            <p className="font-body text-[12px] text-neutral-500 text-center mt-2">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Terms of Service
              </Link>
              <br />
              and{" "}
              <Link
                href="/privacy"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <p className="font-body text-[14px] text-neutral-600 text-center mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={form2.handleSubmit(onStep2Submit)}
          className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] font-body p-[12px] rounded-md border border-red-100">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-3">
            <label className="font-body text-[13px] font-bold text-neutral-800">
              Company Size
            </label>
            <div className="flex flex-col gap-2">
              {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map(
                (size) => {
                  const isActive = form2.watch("companySize") === size;
                  return (
                    <label
                      key={size}
                      className={`flex items-center gap-3 h-[48px] px-4 border rounded-lg cursor-pointer transition-all ${isActive ? "bg-blue-50 border-blue-300" : "bg-white border-neutral-200 hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        value={size}
                        {...form2.register("companySize")}
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? "border-blue-600" : "border-neutral-300"}`}
                      >
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <span
                        className={`text-[14px] ${isActive ? "text-neutral-900 font-medium" : "text-neutral-600"}`}
                      >
                        {size} employees
                      </span>
                    </label>
                  );
                },
              )}
            </div>
            {form2.formState.errors.companySize && (
              <p className="text-[12px] text-red-500 mt-0.5">
                {form2.formState.errors.companySize.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="font-body text-[13px] font-bold text-neutral-800">
              How did you hear about us?
            </label>
            <select
              {...form2.register("hearAbout")}
              className="h-[48px] px-3 bg-white border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-neutral-600"
            >
              <option value="">Select an option</option>
              <option value="search">Search Engine (Google)</option>
              <option value="social">Social Media (LinkedIn, Twitter)</option>
              <option value="friend">Friend or Colleague</option>
              <option value="blog">Blog or Article</option>
              <option value="other">Other</option>
            </select>
            {form2.formState.errors.hearAbout && (
              <p className="text-[12px] text-red-500 mt-0.5">
                {form2.formState.errors.hearAbout.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-[48px] px-6 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 font-body text-[14px] font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-[48px] bg-[#1D4ED8] hover:bg-blue-800 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-neutral-400">
            <Lock className="w-4 h-4" />
            <span className="text-[12px] font-medium">
              Your data is secure and encrypted
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
