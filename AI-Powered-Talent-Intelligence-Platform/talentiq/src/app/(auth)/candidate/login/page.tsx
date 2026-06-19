"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="flex flex-col w-full">
      <div className="text-center mb-[28px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Candidate Portal
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          Enter your email and access token to log in.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-[16px]">
        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] font-body p-[12px] rounded-md border border-red-100 flex items-start gap-[8px]">
            <AlertCircle size={16} className="mt-[2px] shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <div className="flex justify-between items-center">
            <label className="font-body text-[13px] font-semibold text-neutral-700">
              Access Token
            </label>
            <Link
              href="/candidate/forgot-token"
              className="font-body text-[13px] font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot token?
            </Link>
          </div>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. X7K9P2M"
            className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 font-mono tracking-widest placeholder:text-neutral-400 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-[8px] w-full h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="text-white" />
          ) : (
            "Log In"
          )}
        </button>
      </form>
    </div>
  );
}
