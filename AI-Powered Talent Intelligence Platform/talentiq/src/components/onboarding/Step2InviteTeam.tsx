'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, X } from 'lucide-react'

export default function Step2InviteTeam({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      invites: [{ email: '', role: 'MEMBER' }]
    }
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "invites"
  })

  return (
    <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 mt-6">
      <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
        Invite your team
      </h1>
      <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
        Hiring is a team sport. Invite recruiters and hiring managers.
      </p>

      <form onSubmit={handleSubmit(onNext)} className="mt-[32px] flex flex-col gap-[20px]">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-[12px] items-start">
            <div className="flex-1 flex flex-col gap-[6px]">
              <input
                {...register(`invites.${index}.email` as const)}
                placeholder="name@company.com"
                className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]"
              />
            </div>
            <div className="w-[140px] flex flex-col gap-[6px]">
              <select {...register(`invites.${index}.role` as const)} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]">
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="h-[44px] px-[12px] text-neutral-400 hover:text-red-500">
                <X size={20} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ email: '', role: 'MEMBER' })}
          className="flex items-center gap-[8px] text-[14px] font-medium text-primary-500 hover:text-primary-600 w-fit"
        >
          <Plus size={16} /> Add another
        </button>

        <div className="flex items-center gap-[16px] mt-[16px]">
          <button type="button" onClick={onBack} className="h-[48px] px-[24px] border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
            Back
          </button>
          <button type="submit" className="flex-1 h-[48px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg">
            Send Invites
          </button>
        </div>

        <button type="button" onClick={onNext} className="text-[14px] font-medium text-neutral-500 hover:text-neutral-700 text-center mt-[8px]">
          I&apos;ll do this later
        </button>
      </form>
    </div>
  )
}
