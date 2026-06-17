import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/core/database/mongoose";
import { AISummary } from "@/core/database/models/AISummary";
import { Application } from "@/core/database/models/Application";
import { Job } from "@/core/database/models/Job";
import { Candidate } from "@/core/database/models/Candidate";
import { ai } from "@/lib/gemini";

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const forceGenerate = searchParams.get("force") === "true";

    const today = new Date();
    const currentMonday = getMonday(today);
    currentMonday.setHours(0, 0, 0, 0);

    // Try to find existing summary for this week
    if (!forceGenerate) {
      const existingSummary = await AISummary.findOne({
        weekOf: currentMonday,
      });
      if (existingSummary) {
        return NextResponse.json(existingSummary);
      }
    }

    // --- Generate new analytics ---

    // 1. Gather pipeline stats
    const applications = await Application.find()
      .populate("candidate")
      .populate("job")
      .lean();

    const jobs = await Job.find({
      status: { $in: ["published", "active"] },
    }).lean();
    const candidates = await Candidate.find().lean();

    const totalCandidates = candidates.length;
    let totalHired = 0;
    let totalOffersAccepted = 0;
    let sumAiScore = 0;
    let scoredCandidates = 0;

    const stagesCount: Record<string, number> = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Assessment: 0,
      Offer: 0,
      Hired: 0,
      Rejected: 0,
    };

    applications.forEach((app: any) => {
      if (app.stage === "Hired") totalHired++;

      // We assume if timeline has 'offer_accepted', it's an accepted offer
      if (
        app.timeline &&
        app.timeline.some((t: any) => t.type === "offer_accepted")
      ) {
        totalOffersAccepted++;
      }

      if (app.stage in stagesCount) {
        stagesCount[app.stage]++;
      }

      if (typeof app.aiScore === "number") {
        sumAiScore += app.aiScore;
        scoredCandidates++;
      }
    });

    const avgAiScore =
      scoredCandidates > 0 ? Math.round(sumAiScore / scoredCandidates) : 0;

    const pipelineHealthBreakdown = Object.keys(stagesCount).map((stage) => {
      // Dummy logic for avgDaysInStage and conversionRate for the demo
      return {
        stage,
        avgDaysInStage: Math.floor(Math.random() * 5) + 1,
        conversionRate: Math.floor(Math.random() * 30) + 20,
      };
    });

    // Dummy pipeline health score based on hiring ratio
    const pipelineHealth = Math.min(
      100,
      Math.max(0, 70 + (totalHired / Math.max(1, totalCandidates)) * 100),
    );

    // 2. Cross-job Matching Logic
    // Find stalled/rejected candidates to match with open jobs
    const stalledApps = applications.filter(
      (app: any) => app.stage === "Rejected" || app.daysInStage > 14,
    );

    const crossMatches: any[] = [];

    for (const app of stalledApps) {
      if (!app.candidate || !app.job) continue;
      const c = app.candidate as any;
      const j = app.job as any;

      // Very basic intersection heuristic
      const candidateSkills = c.extractedSkills || [];
      if (candidateSkills.length === 0) continue;

      for (const job of jobs) {
        if (job._id.toString() === j._id.toString()) continue; // Skip their original job

        const jobReqs = (job.requirements || []).join(" ").toLowerCase();

        // Count how many candidate skills match job requirements
        const matchedSkills = candidateSkills.filter((s: string) =>
          jobReqs.includes(s.toLowerCase()),
        );

        const matchRatio =
          matchedSkills.length / Math.max(1, candidateSkills.length);
        const matchScore = Math.round(matchRatio * 100);

        // Threshold: 5+ scored candidates, AI score >= 90
        // We will simulate the AI score threshold here (matchScore >= 90)
        if (matchScore >= 90) {
          crossMatches.push({
            candidateId: c._id,
            candidateName: c.name,
            originalJobId: j._id,
            originalJobTitle: j.title,
            matchedJobId: job._id,
            matchedJobTitle: job.title,
            matchScore,
            matchedSkills: matchedSkills.slice(0, 5),
          });
        }
      }
    }

    // 3. AI Generation
    const prompt = `
You are an expert Talent Acquisition AI. Analyze the following ATS pipeline data for the week and write a concise, professional, and insightful summary.

Data:
- Total Candidates: ${totalCandidates}
- Total Hired: ${totalHired}
- Avg AI Score of Candidates: ${avgAiScore}
- Pipeline Health Score: ${Math.round(pipelineHealth)}/100
- Stage Counts: ${JSON.stringify(stagesCount)}

Also mention that we have found ${crossMatches.length} cross-job matches where stalled/rejected candidates are highly qualified for other open roles.

Format:
Return a brief Markdown response (2-3 paragraphs) with key takeaways and recommendations for the recruiting team. Do not include greetings.
`;

    const aiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const aiContent = aiRes.text || "Weekly summary generation failed.";

    const summary = await AISummary.findOneAndUpdate(
      { weekOf: currentMonday },
      {
        weekOf: currentMonday,
        generatedAt: new Date(),
        content: aiContent,
        pipelineHealth,
        pipelineHealthBreakdown,
        crossMatches,
        totalCandidates,
        totalHired,
        totalOffersAccepted,
        avgAiScore,
      },
      { upsert: true, new: true },
    );

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Analytics summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
