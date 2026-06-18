"use client";

import { useState } from "react";
import PlanCard from "@/components/billing/PlanCard";
import UsageBar from "@/components/billing/UsageBar";
import InvoiceTable from "@/components/billing/InvoiceTable";
import UpgradeModal from "@/components/billing/UpgradeModal";

const MOCK_INVOICES = [
  {
    id: "1",
    date: "Oct 1, 2023",
    amount: "$199.00",
    status: "paid" as const,
    pdfUrl: "#",
  },
  {
    id: "2",
    date: "Sep 1, 2023",
    amount: "$199.00",
    status: "paid" as const,
    pdfUrl: "#",
  },
  {
    id: "3",
    date: "Aug 1, 2023",
    amount: "$199.00",
    status: "paid" as const,
    pdfUrl: "#",
  },
];

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function BillingPage() {
  const { user } = useCurrentUser();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  return (
    <div className="pb-[40px]">
      <div className="flex justify-between items-center mb-[32px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
            Billing & Plans
          </h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">
            Manage your subscription, usage, and invoices.
          </p>
        </div>
        <button
          onClick={() => setIsUpgradeOpen(true)}
          className="bg-accent-500 hover:bg-accent-600 text-white font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
        >
          Upgrade Plan
        </button>
      </div>

      <div className="flex flex-col gap-[32px]">
        {/* Usage Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px]">
          <h3 className="font-display text-[18px] font-semibold text-neutral-900 mb-[24px]">
            Current Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
            <UsageBar label="Active Jobs" current={12} limit={15} />
            <UsageBar
              label="AI Screenings (Monthly)"
              current={450}
              limit={500}
            />
          </div>
        </div>

        {/* Plans Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          <PlanCard
            name="Starter"
            price="$99"
            renewalDate="N/A"
            features={["3 Active Jobs", "100 AI Screenings", "Basic Analytics"]}
            isCurrent={user?.company?.billing?.plan === 'starter' || !user?.company?.billing?.plan}
          />
          <PlanCard
            name="Growth"
            price="$199"
            renewalDate="Nov 1, 2023"
            features={[
              "15 Active Jobs",
              "500 AI Screenings",
              "Advanced Analytics",
              "Custom Pipelines",
            ]}
            isCurrent={user?.company?.billing?.plan === 'growth' || user?.company?.billing?.plan === 'pro'}
          />
          <PlanCard
            name="Enterprise"
            price="Custom"
            renewalDate="N/A"
            features={[
              "Unlimited Jobs",
              "Unlimited Screenings",
              "SSO / SAML",
              "Dedicated Support",
            ]}
            isCurrent={user?.company?.billing?.plan === 'enterprise'}
          />
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="p-[24px] border-b border-neutral-100">
            <h3 className="font-display text-[18px] font-semibold text-neutral-900">
              Billing History
            </h3>
          </div>
          <InvoiceTable invoices={MOCK_INVOICES} />
        </div>
      </div>

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
