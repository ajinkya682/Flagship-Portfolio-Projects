"use client"

import * as React from "react"
import { ArrowUpDown } from "lucide-react"

export function JobPerformanceTable() {
  const data = [
    { title: "Senior React Engineer", apps: 245, avgScore: 78, convRate: "4.5%", daysOpen: 45, status: "Active", statusColor: "bg-[#DCFCE7] text-[#166534]" },
    { title: "Product Designer", apps: 412, avgScore: 82, convRate: "2.1%", daysOpen: 62, status: "Active", statusColor: "bg-[#DCFCE7] text-[#166534]" },
    { title: "Marketing Manager", apps: 180, avgScore: 65, convRate: "5.2%", daysOpen: 14, status: "New", statusColor: "bg-[#DBEAFE] text-[#1E40AF]" },
    { title: "DevOps Engineer", apps: 45, avgScore: 88, convRate: "12%", daysOpen: 90, status: "Urgent", statusColor: "bg-[#FEF2F2] text-[#991B1B]" },
    { title: "Sales Executive", apps: 560, avgScore: 72, convRate: "1.8%", daysOpen: 120, status: "Paused", statusColor: "bg-neutral-100 text-neutral-700" },
  ]

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left font-body">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="py-[12px] pr-[16px] text-[12px] font-medium text-neutral-500 min-w-[200px]">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Job Title <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Applications <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Avg AI Score <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Conv. Rate <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Days Open <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] pl-[16px] text-[12px] font-medium text-neutral-500 text-right">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="py-[16px] pr-[16px] text-[14px] font-semibold text-neutral-900">{row.title}</td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">{row.apps}</td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">
                <span className="font-semibold text-primary-600">{row.avgScore}</span>
              </td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">{row.convRate}</td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">{row.daysOpen}</td>
              <td className="py-[16px] pl-[16px] text-right">
                <span className={`inline-flex items-center rounded-full px-[8px] py-[2px] text-[11px] font-bold uppercase tracking-wider ${row.statusColor}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
