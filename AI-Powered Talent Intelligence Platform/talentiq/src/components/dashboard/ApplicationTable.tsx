import * as React from "react"
import { Eye, ArrowRight, Calendar } from "lucide-react"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table"

export function ApplicationTable() {
  const applications = [
    { id: 1, name: "Maria Torres", email: "maria@example.com", role: "Senior Engineer", score: 92, stage: "Interview", applied: "2h ago", source: "LinkedIn" },
    { id: 2, name: "David Kim", email: "david@example.com", role: "Product Designer", score: 88, stage: "Screening", applied: "5h ago", source: "Website" },
    { id: 3, name: "Sarah Lee", email: "sarah@example.com", role: "Data Scientist", score: 85, stage: "Sourced", applied: "1d ago", source: "Referral" },
    { id: 4, name: "James Wilson", email: "james@example.com", role: "Senior Engineer", score: 76, stage: "Offer", applied: "2d ago", source: "LinkedIn" },
    { id: 5, name: "Anita Patel", email: "anita@example.com", role: "Product Manager", score: 95, stage: "Interview", applied: "2d ago", source: "Website" },
    { id: 6, name: "Michael Chang", email: "michael@example.com", role: "Frontend Dev", score: 64, stage: "Screening", applied: "3d ago", source: "Indeed" },
    { id: 7, name: "Jessica Smith", email: "jessica@example.com", role: "UX Researcher", score: 81, stage: "Sourced", applied: "3d ago", source: "LinkedIn" },
    { id: 8, name: "Robert Chen", email: "robert@example.com", role: "Data Scientist", score: 89, stage: "Interview", applied: "4d ago", source: "Referral" },
    { id: 9, name: "Emily Johnson", email: "emily@example.com", role: "Senior Engineer", score: 72, stage: "Screening", applied: "5d ago", source: "Website" },
    { id: 10, name: "Daniel Garcia", email: "daniel@example.com", role: "Backend Dev", score: 58, stage: "Sourced", applied: "6d ago", source: "LinkedIn" },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "border-[#10B981] text-[#10B981] bg-[#F0FDF4]"
    if (score >= 60) return "border-[#F59E0B] text-[#F59E0B] bg-[#FFFBEB]"
    return "border-[#EF4444] text-[#EF4444] bg-[#FEF2F2]"
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Sourced": return "bg-neutral-100 text-neutral-700"
      case "Screening": return "bg-primary-50 text-primary-700"
      case "Interview": return "bg-warning-50 text-warning-700"
      case "Offer": return "bg-accent-50 text-accent-700"
      default: return "bg-neutral-100 text-neutral-700"
    }
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50 hover:bg-neutral-50">
            <TableHead className="w-[250px]">Candidate</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id} className="group cursor-pointer">
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={`https://i.pravatar.cc/150?u=${app.id}`} alt={app.name} className="h-[32px] w-[32px] rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="font-body text-[14px] font-medium text-neutral-900 leading-tight">{app.name}</span>
                    <span className="font-body text-[12px] text-neutral-500">{app.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-body text-[14px] text-neutral-900">{app.role}</span>
              </TableCell>
              <TableCell>
                <div className={`inline-flex h-[24px] items-center justify-center rounded-full border px-[8px] font-body text-[11px] font-bold ${getScoreColor(app.score)}`}>
                  {app.score}
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex h-[24px] items-center rounded-full px-[10px] font-body text-[11px] font-medium ${getStageColor(app.stage)}`}>
                  {app.stage}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-body text-[13px] text-neutral-500">{app.applied}</span>
              </TableCell>
              <TableCell>
                <span className="font-body text-[13px] text-neutral-500">{app.source}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="flex h-[28px] w-[28px] items-center justify-center rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900" title="View Profile">
                    <Eye size={14} />
                  </button>
                  <button className="flex h-[28px] w-[28px] items-center justify-center rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900" title="Move Stage">
                    <ArrowRight size={14} />
                  </button>
                  <button className="flex h-[28px] w-[28px] items-center justify-center rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900" title="Schedule Interview">
                    <Calendar size={14} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
