import { MapPin, Briefcase, Building2 } from "lucide-react";
import ApplicationForm from "@/components/portal/ApplicationForm";
import { notFound } from "next/navigation";
import connectToDatabase from "@/core/database/mongoose";
import { Company } from "@/core/database/models/Company";
import { Job } from "@/core/database/models/Job";

export default async function PublicJobPage({
  params,
}: {
  params: { companySlug: string; jobSlug: string };
}) {
  await connectToDatabase();

  const company = await Company.findOne({ slug: params.companySlug });
  if (!company) {
    notFound();
  }

  // Attempt to find job by slug or ID
  const job = await Job.findOne({
    company: company._id,
    $or: [{ slug: params.jobSlug }, { _id: params.jobSlug.length === 24 ? params.jobSlug : null }],
    status: { $in: ["published", "closed", "draft", "paused"] },
  });

  if (!job) {
    notFound();
  }

  // Map for the frontend component
  const jobObj = JSON.parse(JSON.stringify(job));
  jobObj.id = jobObj._id;

  return (
    <div className="min-h-screen bg-neutral-50/50 font-body pb-[64px]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 py-[20px]">
        <div className="max-w-[800px] mx-auto px-[24px] flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] bg-blue-600 rounded-[10px] flex items-center justify-center text-white font-display font-bold text-[18px] overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              company.name.charAt(0)
            )}
          </div>
          <div>
            <h2 className="font-display font-bold text-[18px] text-neutral-900 leading-tight">
              {company.name}
            </h2>
            <p className="text-[13px] text-neutral-500">Career Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-[24px] mt-[48px]">
        {/* Job Header */}
        <div className="mb-[32px]">
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 leading-tight">
            {jobObj.title}
          </h1>
          <div className="flex flex-wrap items-center gap-[16px] mt-[16px]">
            <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
              <Building2 size={16} className="text-neutral-400" />
              {jobObj.department}
            </div>
            <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
              <MapPin size={16} className="text-neutral-400" />
              {jobObj.location} ({jobObj.remote})
            </div>
            <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
              <Briefcase size={16} className="text-neutral-400" />
              {jobObj.type || jobObj.employmentType}
            </div>
            {jobObj.salaryMin && jobObj.salaryMax && (
              <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
                <span className="text-emerald-600 font-semibold px-[8px] py-[2px] bg-emerald-50 rounded-full text-[12px]">
                  ${(jobObj.salaryMin / 1000).toFixed(0)}k - $
                  {(jobObj.salaryMax / 1000).toFixed(0)}k
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="prose prose-neutral max-w-none mb-[48px] bg-white p-[32px] rounded-[24px] shadow-sm border border-neutral-100">
          <h3 className="font-display text-[18px] font-bold text-neutral-900 mb-[12px]">
            About the role
          </h3>
          <p className="text-[15px] text-neutral-600 leading-relaxed mb-[24px]">
            {jobObj.description === "..."
              ? "We are looking for an experienced professional to join our team. You will be responsible for driving key initiatives and working closely with cross-functional teams to deliver high-quality results. If you are passionate about what you do and thrive in a fast-paced environment, we want to hear from you."
              : jobObj.description}
          </p>

          <h3 className="font-display text-[18px] font-bold text-neutral-900 mb-[12px]">
            Requirements
          </h3>
          <ul className="list-disc pl-[20px] text-[15px] text-neutral-600 space-y-[8px]">
            {jobObj.requirements?.map((req: string, i: number) => <li key={i}>{req}</li>) || (
              <>
                <li>5+ years of relevant experience.</li>
                <li>Strong communication and collaboration skills.</li>
                <li>Proven track record of delivering results.</li>
              </>
            )}
          </ul>
        </div>

        {/* Application Form Component or Fallback Messages */}
        {jobObj.status === "published" && (
          <div id="apply">
            <h3 className="font-display text-[24px] font-bold text-neutral-900 mb-[16px]">
              Apply for this job
            </h3>
            <ApplicationForm job={jobObj} companySlug={params.companySlug} companyName={company.name} />
          </div>
        )}

        {jobObj.status === "closed" && (
          <div className="bg-neutral-100 border border-neutral-200 rounded-[16px] p-[32px] text-center max-w-[500px] mx-auto">
            <h3 className="font-display text-[20px] font-bold text-neutral-900 mb-[8px]">
              This job is closed
            </h3>
            <p className="text-[14px] text-neutral-600">
              We are no longer accepting applications for this role.
            </p>
          </div>
        )}

        {(jobObj.status === "draft" || jobObj.status === "paused") && (
          <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-[32px] text-center max-w-[500px] mx-auto">
            <h3 className="font-display text-[20px] font-bold text-amber-900 mb-[8px]">
              Temporarily stopped
            </h3>
            <p className="text-[14px] text-amber-700">
              We are temporarily pausing new applications for this role. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
