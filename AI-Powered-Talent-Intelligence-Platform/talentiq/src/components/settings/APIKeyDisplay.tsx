"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";

export default function APIKeyDisplay() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [apiKey, setApiKey] = useState("demo_api_key_xxxxxxxxxxxxx");

  const handleCopy = () => {
    if (!isRevealed) return;
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const confirmed = window.confirm(
      "Are you sure? This will invalidate your current API key and any existing integrations will stop working until updated.",
    );

    if (confirmed) {
      setApiKey(`demo_${Math.random().toString(36).substring(2, 15)}`);
      setIsRevealed(true);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-[20px] flex flex-col gap-[16px] font-body max-w-[600px]">
      <div className="flex flex-col gap-[4px]">
        <h4 className="text-[14px] font-semibold text-neutral-900">
          Live API Key
        </h4>
        <p className="text-[13px] text-neutral-500">
          Use this key to authenticate requests to the TalentIQ API.
        </p>
      </div>

      <div className="flex items-center gap-[12px]">
        <div className="flex-1 h-[40px] bg-neutral-50 border border-neutral-200 rounded-md flex items-center px-[12px] overflow-hidden">
          {isRevealed ? (
            <span className="text-[14px] font-mono text-neutral-900 tracking-tight">
              {apiKey}
            </span>
          ) : (
            <span className="text-[14px] font-mono text-neutral-400 tracking-widest mt-[4px]">
              ••••••••••••••••••••••••••••••••••••••••
            </span>
          )}
        </div>

        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-md transition-colors"
          title={isRevealed ? "Hide API Key" : "Reveal API Key"}
        >
          {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {isRevealed && (
        <div className="flex items-center gap-[12px] animate-in fade-in">
          <button
            onClick={handleCopy}
            className="flex items-center gap-[6px] px-[16px] py-[8px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-md text-[13px] font-medium transition-colors"
          >
            {isCopied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy size={14} />
            )}
            {isCopied ? "Copied!" : "Copy to Clipboard"}
          </button>

          <button
            onClick={handleRegenerate}
            className="flex items-center gap-[6px] px-[16px] py-[8px] bg-transparent text-[#DC2626] hover:bg-red-50 rounded-md text-[13px] font-medium transition-colors"
          >
            <RefreshCw size={14} />
            Regenerate Key
          </button>
        </div>
      )}
    </div>
  );
}
