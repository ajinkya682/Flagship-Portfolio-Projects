"use client"

import * as React from "react"
import { Eye, Edit2, Trash2, Mail, FileSearch } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCheckboxHead,
  TableCheckboxCell,
  TableRowActions,
  TableEmptyState,
  TablePagination,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StageBadge, SourceBadge } from "@/components/shared/Badge"
import { AvatarStack } from "@/components/shared/AvatarStack"

const mockData = [
  { id: 1, name: "Eleanor Shellstrop", role: "Senior Product Designer", stage: "Interview", source: "Referral", score: 92, date: "Oct 12" },
  { id: 2, name: "Chidi Anagonye", role: "Ethics Professor", stage: "Sourcing", source: "LinkedIn", score: 85, date: "Oct 14" },
  { id: 3, name: "Jason Mendoza", role: "Amateur DJ", stage: "Rejected", source: "Applied", score: 42, date: "Oct 15" },
  { id: 4, name: "Tahani Al-Jamil", role: "Event Coordinator", stage: "Offer", source: "Agency", score: 95, date: "Oct 16" },
  { id: 5, name: "Michael", role: "Architect", stage: "Screening", source: "Internal", score: 78, date: "Oct 18" },
]

type SortField = "name" | "role" | "score" | null
type SortDirection = "asc" | "desc" | null

export default function TableTestPage() {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [sortField, setSortField] = React.useState<SortField>(null)
  const [sortDir, setSortDir] = React.useState<SortDirection>(null)
  const [page, setPage] = React.useState(1)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc")
      else if (sortDir === "desc") {
        setSortField(null)
        setSortDir(null)
      }
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(mockData.map(d => d.id))
    else setSelectedIds([])
  }

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) setSelectedIds(prev => [...prev, id])
    else setSelectedIds(prev => prev.filter(x => x !== id))
  }

  const isAllSelected = selectedIds.length === mockData.length && mockData.length > 0
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < mockData.length

  const sortedData = [...mockData].sort((a, b) => {
    if (!sortField || !sortDir) return 0
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-body">
      <div className="mx-auto max-w-5xl space-y-12">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">Table Component Test</h1>
          <p className="text-neutral-500">Testing Table layout, selection, sorting, hover actions, and pagination.</p>
        </div>

        {/* 1. Full Data Table */}
        <section className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-semibold">1. Standard Data Table</h2>
            <div className="flex items-center gap-2">
              <AvatarStack urls={[
                "https://i.pravatar.cc/150?u=1",
                "https://i.pravatar.cc/150?u=2",
                "https://i.pravatar.cc/150?u=3",
                "https://i.pravatar.cc/150?u=4"
              ]} max={3} />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <tr>
                <TableCheckboxHead 
                  checked={isAllSelected || (isIndeterminate ? "indeterminate" : false)} 
                  onCheckedChange={handleSelectAll} 
                />
                <TableHead 
                  sortable 
                  sortDirection={sortField === "name" ? sortDir : null} 
                  onSort={() => handleSort("name")}
                >
                  Candidate Name
                </TableHead>
                <TableHead 
                  sortable 
                  sortDirection={sortField === "role" ? sortDir : null} 
                  onSort={() => handleSort("role")}
                >
                  Role
                </TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Source</TableHead>
                <TableHead 
                  sortable 
                  sortDirection={sortField === "score" ? sortDir : null} 
                  onSort={() => handleSort("score")}
                >
                  AI Score
                </TableHead>
                <TableHead className="text-right">Applied</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => {
                const isSelected = selectedIds.includes(row.id)
                return (
                  <TableRow key={row.id} isSelected={isSelected}>
                    <TableCheckboxCell 
                      checked={isSelected} 
                      onCheckedChange={(c) => handleSelect(row.id, c)} 
                    />
                    <TableCell className="font-semibold">{row.name}</TableCell>
                    <TableCell className="text-neutral-500">{row.role}</TableCell>
                    <TableCell><StageBadge stage={row.stage} /></TableCell>
                    <TableCell><SourceBadge source={row.source} /></TableCell>
                    <TableCell>
                      <span className={`font-bold ${row.score >= 80 ? 'text-[#10B981]' : row.score < 50 ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                        {row.score}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-neutral-500">{row.date}</TableCell>
                    
                    {/* Hover Actions */}
                    <TableRowActions>
                      <Button variant="ghost" size="compact" className="h-8 w-8 p-0"><Eye size={14} /></Button>
                      <Button variant="ghost" size="compact" className="h-8 w-8 p-0"><Mail size={14} /></Button>
                      <Button variant="ghost" size="compact" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 size={14} /></Button>
                    </TableRowActions>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <TablePagination 
            totalItems={42} 
            page={page} 
            totalPages={5} 
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(5, p + 1))}
          />
        </section>

        {/* 2. Empty State Table */}
        <section className="space-y-4 pt-8">
          <h2 className="font-display text-xl font-semibold">2. Empty Table State</h2>
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>AI Score</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              <TableEmptyState 
                colSpan={4}
                icon={FileSearch}
                title="No candidates found"
                description="There are no candidates matching your current filters. Try adjusting your search criteria."
                action={<Button variant="primary">Clear Filters</Button>}
              />
            </TableBody>
          </Table>
        </section>

      </div>
    </div>
  )
}
