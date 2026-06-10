"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display text-[20px] font-semibold text-neutral-900">
            Invite Team Member
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-[20px] py-[16px]">
          <div className="flex flex-col gap-[6px]">
            <Label>Email Address</Label>
            <Input type="email" placeholder="colleague@acmecorp.com" />
          </div>

          <div className="flex flex-col gap-[6px]">
            <Label>Role</Label>
            <Select defaultValue="recruiter">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="mt-[8px] w-full" onClick={onClose}>
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
