"use client"

import * as React from "react"
import { CheckCircle2, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UsageBar } from "@/components/settings/UsageBar"

export default function BillingSettingsPage() {
  const invoices = [
    { date: "Oct 1, 2026", amount: "$299.00", status: "Paid", statusColor: "bg-[#DCFCE7] text-[#166534]" },
    { date: "Sep 1, 2026", amount: "$299.00", status: "Paid", statusColor: "bg-[#DCFCE7] text-[#166534]" },
    { date: "Aug 1, 2026", amount: "$299.00", status: "Paid", statusColor: "bg-[#DCFCE7] text-[#166534]" },
    { date: "Jul 1, 2026", amount: "$299.00", status: "Paid", statusColor: "bg-[#DCFCE7] text-[#166534]" },
  ]

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <h1 className="font-display text-[24px] font-bold text-neutral-900 mb-[32px]">Billing & Usage</h1>
      
      {/* Plan Card */}
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-primary-200 bg-primary-50 p-[32px] mb-[32px]">
        <div className="flex justify-between items-start mb-[24px]">
          <div className="flex flex-col">
            <h4 className="font-display text-[16px] font-semibold text-primary-900">Growth Plan</h4>
            <div className="flex items-baseline gap-[8px] mt-[4px]">
              <h2 className="font-display text-[32px] font-bold text-neutral-900">$299</h2>
              <span className="font-body text-[14px] text-neutral-600">/ month</span>
            </div>
            <span className="font-body text-[13px] text-neutral-500 mt-[4px]">Renews on Nov 1, 2026</span>
          </div>
          
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <CheckCircle2 size={16} className="text-primary-600" />
              <span className="font-body text-[13px] font-medium text-neutral-700">Unlimited users</span>
            </div>
            <div className="flex items-center gap-[8px]">
              <CheckCircle2 size={16} className="text-primary-600" />
              <span className="font-body text-[13px] font-medium text-neutral-700">1,000 AI scorecards/mo</span>
            </div>
            <div className="flex items-center gap-[8px]">
              <CheckCircle2 size={16} className="text-primary-600" />
              <span className="font-body text-[13px] font-medium text-neutral-700">Custom pipelines</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[12px] pt-[24px] border-t border-primary-200/50">
          <Button iconRight={<ExternalLink size={16} />}>Manage Plan in Stripe</Button>
          <Button variant="secondary" className="bg-white">View Invoices</Button>
        </div>
      </div>

      {/* Usage */}
      <div className="flex flex-col mb-[48px]">
        <h3 className="font-display text-[18px] font-semibold text-neutral-900 mb-[24px]">Current Usage</h3>
        <div className="flex flex-col gap-[24px]">
          <UsageBar label="Active Jobs" current={8} limit={10} />
          <UsageBar label="AI Scorecards Generated" current={845} limit={1000} />
          <UsageBar label="Storage (Resumes & Files)" current={4.2} limit={50} />
        </div>
      </div>

      {/* Invoices */}
      <div className="flex flex-col">
        <h3 className="font-display text-[18px] font-semibold text-neutral-900 mb-[16px]">Invoice History</h3>
        <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left font-body">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="py-[12px] px-[20px] text-[12px] font-medium text-neutral-500">Date</th>
                <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Amount</th>
                <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Status</th>
                <th className="py-[12px] px-[20px] text-[12px] font-medium text-neutral-500 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={idx} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="py-[16px] px-[20px] text-[14px] font-medium text-neutral-900">{inv.date}</td>
                  <td className="py-[16px] px-[16px] text-[14px] text-neutral-600">{inv.amount}</td>
                  <td className="py-[16px] px-[16px]">
                    <span className={`inline-flex items-center rounded-full px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider ${inv.statusColor}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-[16px] px-[20px] text-right">
                    <Button variant="ghost" className="h-[32px] px-2 text-[13px] font-medium text-neutral-700" iconLeft={<Download size={14} />}>
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
