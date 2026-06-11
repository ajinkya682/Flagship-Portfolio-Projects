'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'

export default function OfferForm() {
  const [salary, setSalary] = useState('')
  const [currency, setCurrency] = useState('USD')

  return (
    <div className="flex flex-col gap-[20px] font-body bg-white p-[24px] rounded-xl shadow-sm border border-[#E5E7EB]">
      <h3 className="text-[16px] font-semibold text-neutral-900 border-b border-neutral-100 pb-[12px]">Offer Details</h3>
      
      <div className="grid grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-semibold text-neutral-700">Base Salary</label>
          <div className="flex gap-[8px]">
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-[80px] h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 bg-neutral-50"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <input 
              type="number" 
              placeholder="e.g. 120000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="flex-1 h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-semibold text-neutral-700">Equity / Options</label>
          <input 
            type="text" 
            placeholder="e.g. 10,000 ISOs"
            className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-semibold text-neutral-700">Target Start Date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-[12px] top-[12px] text-neutral-400" />
            <input 
              type="date" 
              className="w-full h-[40px] pl-[36px] pr-[12px] rounded-md border border-neutral-200 text-[14px] focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-semibold text-neutral-700">Offer Expiration Date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-[12px] top-[12px] text-neutral-400" />
            <input 
              type="date" 
              className="w-full h-[40px] pl-[36px] pr-[12px] rounded-md border border-neutral-200 text-[14px] focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[6px] mt-[8px]">
        <label className="text-[13px] font-semibold text-neutral-700">Additional Notes / Perks</label>
        <textarea 
          placeholder="Signing bonus, relocation package, etc..."
          className="w-full min-h-[80px] rounded-md border border-neutral-200 p-[12px] text-[14px] focus:outline-none focus:border-primary-500 resize-y"
        />
      </div>

      <div className="flex justify-end pt-[16px] border-t border-neutral-100">
        <button className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-[13px] px-[16px] py-[8px] rounded-md transition-colors">
          Save Draft
        </button>
      </div>

    </div>
  )
}
