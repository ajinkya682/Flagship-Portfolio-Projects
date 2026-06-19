'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

function ResetTokenForm() {
  const [token, setToken] = useState('');
  const [newToken, setNewToken] = useState('');
  const [confirmToken, setConfirmToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return;
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newToken !== confirmToken) {
      setError('Access tokens do not match.');
      return;
    }

    if (newToken.length < 6) {
      setError('Access token must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/portal/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newToken }), // API uses "password" conceptually
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset access token');
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
          Access Token Updated
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mb-[32px]">
          Your new access token has been successfully saved. You can now use it to log in.
        </p>
        <button
          onClick={() => router.push('/candidate/login')}
          className="w-full h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="text-left mb-[28px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Set New Access Token
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          Create a new access token to log into the Candidate Portal.
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
          <label className="font-body text-[13px] font-semibold text-neutral-700">New Access Token</label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              required
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full h-[44px] pl-[12px] pr-[40px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-[12px] top-[12px] text-neutral-400 hover:text-neutral-600"
            >
              {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Confirm Access Token</label>
          <input
            type={showToken ? 'text' : 'password'}
            required
            value={confirmToken}
            onChange={(e) => setConfirmToken(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="mt-[8px] w-full h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner size="sm" className="text-white" /> : 'Save New Token'}
        </button>
      </form>
    </div>
  );
}

export default function ResetTokenPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><LoadingSpinner size="md" className="text-blue-500" /></div>}>
      <ResetTokenForm />
    </Suspense>
  );
}
