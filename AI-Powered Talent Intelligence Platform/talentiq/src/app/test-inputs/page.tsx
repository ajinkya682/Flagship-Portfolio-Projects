"use client"

import * as React from "react"
import { Input, SearchInput, PasswordInput } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { FileUploadZone } from "@/components/ui/file-upload"
import { PasswordStrengthMeter } from "@/components/ui/password-strength"
import { DateRangePicker } from "@/components/ui/date-picker"
import { Slider } from "@/components/ui/slider"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

export default function InputsTestPage() {
  const [password, setPassword] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-body">
      <div className="mx-auto max-w-4xl space-y-12 rounded-xl bg-white p-8 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">Input Components Test</h1>
          <p className="text-neutral-500">Testing all forms and inputs from Section 2.2</p>
        </div>

        {/* Text Input */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">1. Text Input</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input label="Default" placeholder="Enter text..." />
            <Input label="With Helper" placeholder="Enter text..." helperText="This is a helper text." />
            <Input label="Filled State" defaultValue="Filled value" />
            <Input label="Error State" placeholder="Enter text..." error="This field is required." defaultValue="Wrong value" />
            <Input label="Disabled" placeholder="Cannot edit this" disabled />
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">2. Search Input</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <SearchInput label="Search" placeholder="Search candidates..." />
            <SearchInput label="Search with value" defaultValue="Software Engineer" />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">3. Password Input & Strength</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <PasswordInput 
                label="New Password" 
                placeholder="Enter password..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrengthMeter password={password} />
            </div>
            <PasswordInput label="Error State" placeholder="Enter password..." error="Password too short" defaultValue="weak" />
          </div>
        </div>

        {/* Select */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">4. Select</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Select>
              <SelectTrigger label="Stage">
                <SelectValue placeholder="Select a stage..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sourcing">Sourcing</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger label="Error State" error="Please select a stage">
                <SelectValue placeholder="Select a stage..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sourcing">Sourcing</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Multi-Select */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">5. Multi-Select</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <MultiSelect
              label="Skills"
              placeholder="Add skills..."
              options={[
                { label: "React", value: "react" },
                { label: "TypeScript", value: "ts" },
                { label: "Node.js", value: "node" },
                { label: "Python", value: "python" },
                { label: "AWS", value: "aws" },
              ]}
              value={["react", "ts", "python", "aws", "node"]}
            />
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">6. Textarea</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Textarea label="Notes" placeholder="Add some notes..." />
            <Textarea label="Error State" placeholder="Add some notes..." error="Notes cannot be empty if you selected rejection." />
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">7. Rich Text Editor</h2>
          <RichTextEditor 
            label="Job Description" 
            value="<p>We are looking for a <strong>Senior Frontend Engineer</strong> to join our team.</p><ul><li>React expertise</li><li>TypeScript proficiency</li></ul>" 
          />
        </div>

        {/* File Upload Zone */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">8. File Upload Zone</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <FileUploadZone label="Resume" helperText="PDF only, max 10MB" />
            <FileUploadZone label="Error State" error="File size exceeds 10MB limit." />
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">9. Date Range Picker</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <DateRangePicker 
              label="Filter by Date" 
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
        </div>

        {/* Score Range Slider */}
        <div className="space-y-4">
          <h2 className="border-b pb-2 font-display text-lg font-semibold">10. Score Range Slider</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Slider
              label="AI Score Range"
              defaultValue={[40, 90]}
              max={100}
              step={1}
              helperText="Filter candidates by AI assessment score."
            />
          </div>
        </div>

      </div>
    </div>
  )
}
