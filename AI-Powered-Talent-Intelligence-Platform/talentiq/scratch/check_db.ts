import mongoose from 'mongoose';
import { Job } from './src/core/database/models/Job';
import { Candidate } from './src/core/database/models/Candidate';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talentiq');
  const jobs = await Job.find({}).lean();
  const candidates = await Candidate.find({}).lean();
  console.log('Jobs:', JSON.stringify(jobs.map(j => ({ id: j._id, title: j.title, skills: j.skills, requirements: j.requirements })), null, 2));
  console.log('Candidates:', JSON.stringify(candidates.map(c => ({ id: c._id, name: c.name, extractedSkills: c.extractedSkills })), null, 2));
  process.exit(0);
}
main().catch(console.error);
