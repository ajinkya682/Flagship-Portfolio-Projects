import mongoose from 'mongoose';
import { Job } from './core/database/models/Job';
import { Candidate } from './core/database/models/Candidate';
import { Application } from './core/database/models/Application';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  const jobs = await Job.find({}).lean() as any[];
  const candidates = await Candidate.find({}).lean() as any[];
  const applications = await Application.find({}).populate("candidate").populate("job").lean() as any[];
  
  for (const job of jobs) {
    let requiredSkillsArr = [...(job.skills || []), ...(job.requirements || [])].map((s: string) => s.toLowerCase());
    
    if (requiredSkillsArr.length === 0) {
      const fillers = ["developer", "engineer", "intern", "senior", "junior", "lead", "manager", "software", "specialist", "enginer"];
      const words = job.title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
      requiredSkillsArr = words.filter(w => !fillers.includes(w));
      if (requiredSkillsArr.length === 0) requiredSkillsArr = words;
    }
    if (requiredSkillsArr.length === 0) continue;

    console.log(`\nJob: ${job.title} | Keywords:`, requiredSkillsArr);

    for (const candidate of candidates) {
      const candidateSkills = (candidate.extractedSkills || []).map((s: string) => s.toLowerCase());
      if (candidateSkills.length === 0) continue;

      const matchedKeywords = requiredSkillsArr.filter(r => candidateSkills.some(s => s.includes(r) || r.includes(s)));
      const matchScore = Math.min(100, Math.round((matchedKeywords.length / requiredSkillsArr.length) * 100));

      if (matchScore > 50) {
        console.log(`  Candidate: ${candidate.name} | Score: ${matchScore}% | Matched: ${matchedKeywords}`);
      }
    }
  }
  process.exit(0);
}
main().catch(console.error);
