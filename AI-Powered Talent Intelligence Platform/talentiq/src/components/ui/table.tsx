import * as React from "react"
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-white">
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-neutral-50", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { isSelected?: boolean }
>(({ className, isSelected, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "group relative border-b border-neutral-100 bg-white transition-colors duration-[80ms] hover:bg-neutral-50",
      isSelected && "bg-primary-50 hover:bg-primary-50",
      className
    )}
    {...props}
  >
    {/* Left selected border spec: 3px primary-500 left border */}
    {isSelected && (
      <td className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-500 p-0 m-0 border-0 pointer-events-none" />
    )}
    {props.children}
  </tr>
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { 
    sortable?: boolean, 
    sortDirection?: "asc" | "desc" | null,
    onSort?: () => void 
  }
>(({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-11 px-4 text-left align-middle font-body text-[11px] font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap",
      sortable && "cursor-pointer select-none group/th hover:text-neutral-700",
      sortDirection && "text-neutral-900",
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center gap-1">
      {children}
      {sortable && (
        <span className="flex flex-col">
          <ChevronUp 
            size={12} 
            className={cn(
              "-mb-[3px] text-neutral-300 transition-opacity",
              !sortDirection && "opacity-0 group-hover/th:opacity-100",
              sortDirection === "asc" && "text-neutral-900 opacity-100",
              sortDirection === "desc" && "opacity-0"
            )} 
          />
          <ChevronDown 
            size={12} 
            className={cn(
              "text-neutral-300 transition-opacity",
              !sortDirection && "opacity-0 group-hover/th:opacity-100",
              sortDirection === "desc" && "text-neutral-900 opacity-100",
              sortDirection === "asc" && "opacity-0"
            )} 
          />
        </span>
      )}
    </div>
  </th>
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "h-14 px-4 align-middle font-body text-[14px] text-neutral-900",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCheckboxCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { checked?: boolean, onCheckedChange?: (c: boolean) => void }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("w-11 px-4 align-middle text-center", className)}
    {...props}
  >
    <div className="flex items-center justify-center">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  </td>
))
TableCheckboxCell.displayName = "TableCheckboxCell"

const TableCheckboxHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { checked?: boolean | "indeterminate", onCheckedChange?: (c: boolean) => void }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("w-11 h-11 px-4 align-middle text-center", className)}
    {...props}
  >
    <div className="flex items-center justify-center">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  </th>
))
TableCheckboxHead.displayName = "TableCheckboxHead"

const TableRowActions = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <td className="p-0 m-0 border-0">
    <div 
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 transition-opacity duration-120 group-hover:opacity-100 bg-neutral-50 px-2 py-1 rounded-md shadow-sm border border-neutral-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  </td>
)

// Empty State for inside the table
const TableEmptyState = ({ 
  colSpan, 
  icon: Icon, 
  title, 
  description,
  action
}: { 
  colSpan: number, 
  icon: React.ElementType, 
  title: string, 
  description: string,
  action?: React.ReactNode
}) => (
  <tr>
    <td colSpan={colSpan} className="py-16 px-6 text-center">
      <div className="flex flex-col items-center justify-center">
        <Icon size={40} className="mb-4 text-neutral-300" strokeWidth={1.5} />
        <h3 className="font-body text-[15px] font-semibold text-neutral-700">{title}</h3>
        <p className="mt-1 font-body text-[13px] text-neutral-500 max-w-sm">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </td>
  </tr>
)

const TablePagination = ({
  className,
  totalItems,
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  className?: string
  totalItems: number
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}) => {
  const start = (page - 1) * 10 + 1
  const end = Math.min(page * 10, totalItems)
  
  return (
    <div className={cn("flex items-center justify-between border-t border-neutral-200 p-4 bg-white rounded-b-[var(--radius-lg)]", className)}>
      <span className="font-body text-[13px] text-neutral-500">
        Showing {start}-{end} of {totalItems} results
      </span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="compact" onClick={onPrev} disabled={page <= 1}>Previous</Button>
        <div className="flex items-center gap-1 px-2">
          {/* Simple pagination visualization */}
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              className={cn(
                "h-7 w-7 rounded-md font-body text-[14px] flex items-center justify-center transition-colors",
                page === i + 1 ? "font-semibold text-primary-500 bg-primary-50" : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="compact" onClick={onNext} disabled={page >= totalPages}>Next</Button>
      </div>
    </div>
  )
}

export {
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
}
