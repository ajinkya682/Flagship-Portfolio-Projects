'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ForgotTokenPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/portal/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request reset link');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col w-full text-center">
        <div className="mx-auto flex items-center justify-center h-[56px] w-[56px] rounded-full bg-emerald-100 text-emerald-600 mb-[24px]">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight mb-[12px]">
          Check your email
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mb-[32px]">
          We have sent a reset link to <span className="font-medium text-neutral-900">{email}</span>. Click the link to set a new access token.
        </p>
        <Link href="/candidate/login" className="font-body text-[15px] font-medium text-blue-600 hover:text-blue-700">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Link href="/candidate/login" className="inline-flex items-center gap-[8px] text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-[32px] w-fit">
        <ArrowLeft size={16} /> Back to login
      </Link>
      
      <div className="text-left mb-[28px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Forgot Access Token?
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          Enter your email to receive a secure link to create a new access token.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] font-body p-[12px] rounded-md border border-red-100 flex items-start gap-[8px]">
            <AlertCircle size={16} className="mt-[2px] shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="mt-[8px] w-full h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner size="sm" className="text-white" /> : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
