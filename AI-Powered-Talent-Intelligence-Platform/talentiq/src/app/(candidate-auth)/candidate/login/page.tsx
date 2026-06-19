"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Mail, Lock, Eye, EyeOff, User, Hexagon } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [redirectPath, setRedirectPath] = useState("/candidate/dashboard");

  useEffect(() => {
    // We do this inside useEffect to avoid hydration errors with useSearchParams
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/candidate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = redirectPath;
      } else {
        setError(data.error || "Invalid email or access token.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      <div className="relative mb-6">
        <Hexagon className="w-16 h-16 text-blue-600 fill-blue-600" />
        <User className="w-7 h-7 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="text-center mb-[28px] w-full">
        <h1 className="font-display text-[26px] font-bold text-neutral-900 leading-tight">
          Candidate Portal
        </h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[8px]">
          Enter your email and access token to log in.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-[20px] w-full">
        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] font-body p-[12px] rounded-md border border-red-100 flex items-start gap-[8px]">
            <AlertCircle size={16} className="mt-[2px] shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-[8px]">
          <label className="font-body text-[13px] font-semibold text-neutral-900">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-[48px] pl-[40px] pr-[12px] bg-white border border-neutral-200 rounded-lg text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-center">
            <label className="font-body text-[13px] font-semibold text-neutral-900">
              Access Token
            </label>
            <Link
              href="/candidate/forgot-token"
              className="font-body text-[13px] font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot token?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. X7K9P2M"
              className="w-full h-[48px] pl-[40px] pr-[40px] bg-white border border-neutral-200 rounded-lg text-[14px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-[8px] w-full h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="text-white" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Log In
            </>
          )}
        </button>
      </form>
    </div>
  );
}
