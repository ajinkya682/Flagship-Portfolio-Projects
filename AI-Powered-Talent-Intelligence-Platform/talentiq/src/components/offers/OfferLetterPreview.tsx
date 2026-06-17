export default function OfferLetterPreview() {
  return (
    <div className="bg-neutral-50 rounded-lg p-[32px] border border-neutral-200 font-serif flex flex-col gap-[24px]">
      <div className="text-center mb-[16px]">
        <h2 className="text-[24px] font-bold text-neutral-900 tracking-tight">TALENTIQ TECHNOLOGIES INC.</h2>
        <p className="text-[14px] text-neutral-500 mt-[4px]">123 Innovation Drive, San Francisco, CA 94105</p>
      </div>

      <div className="flex flex-col gap-[16px] text-[15px] text-neutral-800 leading-relaxed">
        <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <p>Dear <strong>Jennifer Park</strong>,</p>
        
        <p>
          We are thrilled to offer you the position of <strong>Senior Software Engineer</strong> at TalentIQ Technologies Inc. 
          We were incredibly impressed by your background and believe you will be a fantastic addition to our engineering team.
        </p>

        <p>
          As discussed, your starting base salary will be <strong>$165,000 USD</strong> per year, paid semi-monthly in accordance 
          with the company's normal payroll procedures.
        </p>

        <p>
          Subject to the approval of the Company's Board of Directors, you will be granted an option to purchase 
          <strong>10,000 shares</strong> of the Company's common stock.
        </p>

        <p>
          We propose that your start date will be <strong>Monday, October 16th, 2023</strong>.
        </p>

        <p>
          Please note that this offer is contingent upon the successful completion of a background check and your 
          ability to provide proof of your right to work in the United States.
        </p>

        <p>
          To accept this offer, please sign and date this letter by <strong>Friday, October 6th, 2023</strong>.
        </p>

        <p className="mt-[16px]">
          We look forward to welcoming you to the team!
        </p>

        <div className="mt-[32px] flex flex-col gap-[8px]">
          <p>Sincerely,</p>
          <p className="font-bold">Sarah Recruiter</p>
          <p className="text-[13px] text-neutral-500">Talent Acquisition Manager<br />TalentIQ Technologies Inc.</p>
        </div>

      </div>
    </div>
  )
}
