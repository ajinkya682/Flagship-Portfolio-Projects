'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  companyName: z.string().min(2, 'Required'),
  industry: z.string().min(1, 'Required'),
  size: z.string().min(1, 'Required'),
  timezone: z.string().min(1, 'Required'),
})

export default function Step1CompanySetup({ onNext }: { onNext: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 mt-6">
      <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
        Tell us about your company
      </h1>
      <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
        This helps us tailor your workspace and AI models.
      </p>

      <form onSubmit={handleSubmit(onNext)} className="mt-[32px] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Company Name</label>
          <input
            {...register('companyName')}
            className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Industry</label>
            <select {...register('industry')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]">
              <option value="">Select</option>
              <option value="tech">Technology</option>
              <option value="health">Healthcare</option>
              <option value="finance">Finance</option>
            </select>
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Size</label>
            <select {...register('size')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]">
              <option value="">Select</option>
              <option value="1-50">1-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200+</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Timezone</label>
          <select {...register('timezone')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]">
            <option value="">Select</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>

        <button type="submit" className="mt-[16px] h-[48px] bg-primary-500 text-white font-semibold rounded-lg">
          Continue
        </button>
      </form>
    </div>
  )
}
