"use client"

import * as React from "react"
import { Copy, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function SettingSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[20px] pb-[32px] mb-[32px] border-b border-neutral-200 last:border-0 last:mb-0 last:pb-0">
      <h3 className="font-display text-[18px] font-semibold text-neutral-900">{title}</h3>
      <div className="flex flex-col gap-[20px]">
        {children}
      </div>
    </div>
  )
}

export default function GeneralSettingsPage() {
  return (
    <div className="flex flex-col w-full animate-fade-in">
      <h1 className="font-display text-[24px] font-bold text-neutral-900 mb-[32px]">General Settings</h1>
      
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[32px] shadow-sm">
        
        <SettingSection title="Company Profile">
          <div className="flex flex-col gap-[6px]">
            <Label>Company Name</Label>
            <Input defaultValue="Acme Corp" className="max-w-[400px]" />
          </div>

          <div className="flex flex-col gap-[6px]">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-[16px]">
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[var(--radius-md)] bg-neutral-900 text-white font-display font-bold text-[24px]">
                A
              </div>
              <Button variant="secondary" className="h-[36px] bg-white" iconLeft={<UploadCloud size={16} />}>
                Upload Logo
              </Button>
            </div>
            <span className="font-body text-[12px] text-neutral-500 mt-[4px]">Recommended size: 256x256px. Max size: 2MB.</span>
          </div>

          <div className="grid grid-cols-2 gap-[16px] max-w-[400px]">
            <div className="flex flex-col gap-[6px]">
              <Label>Industry</Label>
              <Select defaultValue="software">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software & Technology</SelectItem>
                  <SelectItem value="finance">Financial Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label>Company Size</Label>
              <Select defaultValue="50-200">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="50-200">50-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[16px] max-w-[400px]">
            <div className="flex flex-col gap-[6px]">
              <Label>Timezone</Label>
              <Select defaultValue="pst">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                  <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label>Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingSection>

        <SettingSection title="Career Page">
          <div className="flex flex-col gap-[6px]">
            <Label>Career Page URL</Label>
            <div className="flex items-center gap-[8px] max-w-[500px]">
              <Input readOnly value="https://acmecorp.talentiq.com/careers" className="bg-neutral-50 text-neutral-500" />
              <Button variant="secondary" className="h-[40px] px-3 bg-white text-neutral-600">
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-[6px]">
            <Label>Custom Subdomain</Label>
            <div className="flex items-center max-w-[400px]">
              <span className="flex items-center justify-center h-[40px] px-[12px] rounded-l-[var(--radius-md)] border border-r-0 border-neutral-300 bg-neutral-100 font-body text-[14px] text-neutral-500 select-none">
                talentiq.com/
              </span>
              <Input defaultValue="acmecorp" className="rounded-none focus-visible:z-10" />
              <span className="flex items-center justify-center h-[40px] px-[12px] rounded-r-[var(--radius-md)] border border-l-0 border-neutral-300 bg-neutral-100 font-body text-[14px] text-neutral-500 select-none">
                .com
              </span>
            </div>
          </div>
        </SettingSection>

        <div className="flex justify-end pt-[8px]">
          <Button className="h-[40px]">Save Changes</Button>
        </div>

      </div>
    </div>
  )
}
