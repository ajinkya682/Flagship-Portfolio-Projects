"use client";

import { useState, useEffect } from "react";
import { KeyRound, Mail, BrainCircuit, ExternalLink } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import api from "@/lib/api";

export default function ApiSettingsPage() {
  const { user } = useCurrentUser();

  const [savingGemini, setSavingGemini] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [geminiSuccess, setGeminiSuccess] = useState(false);

  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    if (user?.company?.apiKeys) {
      setGeminiKey(user.company.apiKeys.geminiApiKey || "");
    }
  }, [user]);

  const handleSaveGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.company?.id) return;

    setSavingGemini(true);
    setGeminiError(null);
    setGeminiSuccess(false);

    try {
      const updatedKeys = {
        ...user.company.apiKeys,
        geminiApiKey: geminiKey,
      };
      await api.patch(`/companies/\${user.company.id}`, {
        apiKeys: updatedKeys,
      });
      setGeminiSuccess(true);
      setTimeout(() => setGeminiSuccess(false), 3000);
    } catch (err: any) {
      setGeminiError(
        err.response?.data?.error || "Failed to save Gemini API key",
      );
    } finally {
      setSavingGemini(false);
    }
  };

  return (
    <div className="flex flex-col gap-[32px] max-w-[800px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">
          API & Integrations
        </h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">
          Configure external services by providing your own API credentials.
        </p>
      </div>

      <div className="flex flex-col gap-[32px]">
        {/* AI Credentials */}
        <form
          onSubmit={handleSaveGemini}
          className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden"
        >
          <div className="p-[24px] border-b border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-[16px]">
            <div className="flex gap-[16px]">
              <div className="w-[40px] h-[40px] bg-purple-50 rounded-[12px] flex items-center justify-center shrink-0">
                <BrainCircuit size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="font-display text-[18px] font-bold text-neutral-900">
                  Google Gemini AI
                </h2>
                <p className="font-body text-[13px] text-neutral-500 mt-[4px] leading-relaxed max-w-[500px]">
                  Power the AI Brain, candidate scorecards, and cross-job
                  matching with your own Gemini API key. If left blank, TalentIQ
                  will use its default rate-limited key.
                </p>
              </div>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[32px] px-[12px] bg-white border border-neutral-200 text-neutral-600 rounded-[6px] text-[12px] font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-[6px] shrink-0 shadow-sm"
            >
              Get API Key <ExternalLink size={12} />
            </a>
          </div>

          <div className="p-[24px]">
            {geminiError && (
              <div className="mb-[16px] p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
                {geminiError}
              </div>
            )}
            {geminiSuccess && (
              <div className="mb-[16px] p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body">
                Gemini API key saved successfully!
              </div>
            )}

            <div className="flex flex-col gap-[6px] mb-[24px]">
              <label className="font-body text-[13px] font-semibold text-neutral-700">
                GEMINI_API_KEY
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 font-mono"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingGemini}
                className="h-[36px] px-[16px] bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-body text-[13px] font-semibold rounded-[8px] transition-colors flex items-center gap-[6px]"
              >
                {savingGemini ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <KeyRound size={14} />
                )}{" "}
                Save AI Key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
