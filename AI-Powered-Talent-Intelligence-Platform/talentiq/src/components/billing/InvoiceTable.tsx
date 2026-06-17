import { Download } from 'lucide-react'

interface InvoiceTableProps {
  invoices: {
    id: string
    date: string
    amount: string
    status: 'paid' | 'pending' | 'failed'
    pdfUrl: string
  }[]
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="px-[8px] py-[2px] rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">Paid</span>
      case 'pending': return <span className="px-[8px] py-[2px] rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider">Pending</span>
      case 'failed': return <span className="px-[8px] py-[2px] rounded-full bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider">Failed</span>
      default: return null
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse font-body">
        <thead>
          <tr className="border-b border-neutral-100">
            <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Date</th>
            <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Amount</th>
            <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
            <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider text-right">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-[16px] py-[24px] text-center text-[13px] text-neutral-500 italic">
                No billing history available yet.
              </td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors h-[56px]">
                <td className="px-[16px] py-[12px] text-[14px] text-neutral-900 font-medium">{inv.date}</td>
                <td className="px-[16px] py-[12px] text-[14px] text-neutral-700">{inv.amount}</td>
                <td className="px-[16px] py-[12px]">{getStatusBadge(inv.status)}</td>
                <td className="px-[16px] py-[12px] text-right">
                  <button className="text-neutral-500 hover:text-primary-600 transition-colors inline-flex items-center gap-[4px] text-[13px] font-medium">
                    <Download size={14} /> PDF
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
