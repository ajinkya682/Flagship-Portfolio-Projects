"use client"

import * as React from "react"
import { ArrowUpDown } from "lucide-react"

export function TeamPerformanceTable() {
  const data = [
    { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=a1", reviewed: 420, response: "24h", interviews: 45, offers: 12, hireRate: "26%" },
    { name: "Alex Kumar", avatar: "https://i.pravatar.cc/150?u=a2", reviewed: 380, response: "18h", interviews: 32, offers: 8, hireRate: "25%" },
    { name: "Jessica Smith", avatar: "https://i.pravatar.cc/150?u=a3", reviewed: 512, response: "36h", interviews: 58, offers: 14, hireRate: "24%" },
    { name: "David Kim", avatar: "https://i.pravatar.cc/150?u=a4", reviewed: 290, response: "12h", interviews: 28, offers: 9, hireRate: "32%" },
  ]

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left font-body">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="py-[12px] pr-[16px] text-[12px] font-medium text-neutral-500 min-w-[200px]">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Recruiter <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Reviewed <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Avg Response <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Interviews <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">
              <div className="flex items-center gap-[4px] cursor-pointer hover:text-neutral-900">
                Offers <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="py-[12px] pl-[16px] text-[12px] font-medium text-neutral-500 text-right">
              <div className="flex items-center justify-end gap-[4px] cursor-pointer hover:text-neutral-900">
                Hire Rate <ArrowUpDown size={12} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="py-[16px] pr-[16px]">
                <div className="flex items-center gap-[12px]">
                  <img src={row.avatar} alt={row.name} className="h-[32px] w-[32px] rounded-full object-cover" />
                  <span className="text-[14px] font-semibold text-neutral-900">{row.name}</span>
                </div>
              </td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">{row.reviewed}</td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">{row.response}</td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">{row.interviews}</td>
              <td className="py-[16px] px-[16px] text-[14px] text-neutral-700">{row.offers}</td>
              <td className="py-[16px] pl-[16px] text-[14px] font-semibold text-neutral-900 text-right">{row.hireRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
