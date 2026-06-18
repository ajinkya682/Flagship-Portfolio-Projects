import mongoose from 'mongoose';
import { Company } from '../core/database/models/Company';
import { User } from '../core/database/models/User';

import { Job } from '../core/database/models/Job';
import { Application } from '../core/database/models/Application';
import { Candidate } from '../core/database/models/Candidate';
import { Message } from '../core/database/models/Message';
import { Offer } from '../core/database/models/Offer';
import { HireLetter } from '../core/database/models/HireLetter';
import { Interview } from '../core/database/models/Interview';
import { Assignment } from '../core/database/models/Assignment';
import { Scorecard } from '../core/database/models/Scorecard';

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  
  // Force initialize models
  console.log(Job.modelName, Application.modelName, Candidate.modelName, Message.modelName, Offer.modelName, HireLetter.modelName, Interview.modelName, Assignment.modelName, Scorecard.modelName, Company.modelName, User.modelName);

  try {
    // 1. Applications -> Job -> Company
    const applications = await Application.find({ companyId: { $exists: false } }).populate('job');
    let appCount = 0;
    for (const app of applications) {
      if (app.job && (app.job as any).company) {
        app.companyId = (app.job as any).company;
        await app.save();
        appCount++;
      }
    }
    console.log(`Migrated ${appCount} applications`);

    // 2. Candidates -> Application -> Job -> Company
    // We can just grab any application for the candidate now that applications have companyId
    const candidates = await Candidate.find({ companyId: { $exists: false } });
    let candCount = 0;
    for (const candidate of candidates) {
      const app = await Application.findOne({ candidate: candidate._id });
      if (app && app.companyId) {
        candidate.companyId = app.companyId;
        await candidate.save();
        candCount++;
      }
    }
    console.log(`Migrated ${candCount} candidates`);

    // 3. Messages -> Candidate -> CompanyId
    const messages = await Message.find({ companyId: { $exists: false } });
    let msgCount = 0;
    for (const msg of messages) {
      const candidate = await Candidate.findById(msg.candidateId);
      if (candidate && candidate.companyId) {
        msg.companyId = candidate.companyId;
        await msg.save();
        msgCount++;
      }
    }
    console.log(`Migrated ${msgCount} messages`);

    // 4. Offers -> Application -> CompanyId
    const offers = await Offer.find({ companyId: { $exists: false } }).populate('application');
    let offerCount = 0;
    for (const offer of offers) {
      if (offer.application && (offer.application as any).companyId) {
        offer.companyId = (offer.application as any).companyId;
        await offer.save();
        offerCount++;
      }
    }
    console.log(`Migrated ${offerCount} offers`);

    // 5. HireLetters -> Application -> CompanyId
    const hireLetters = await HireLetter.find({ companyId: { $exists: false } }).populate('applicationId');
    let hlCount = 0;
    for (const hl of hireLetters) {
      if (hl.applicationId && (hl.applicationId as any).companyId) {
        hl.companyId = (hl.applicationId as any).companyId;
        await hl.save();
        hlCount++;
      }
    }
    console.log(`Migrated ${hlCount} hire letters`);

    // 6. Interviews -> Application -> CompanyId
    const interviews = await Interview.find({ companyId: { $exists: false } }).populate('application');
    let intCount = 0;
    for (const int of interviews) {
      if (int.application && (int.application as any).companyId) {
        int.companyId = (int.application as any).companyId;
        await int.save();
        intCount++;
      }
    }
    console.log(`Migrated ${intCount} interviews`);

    // 7. Assignments -> Application -> CompanyId
    const assignments = await Assignment.find({ companyId: { $exists: false } }).populate('applicationId');
    let assignCount = 0;
    for (const assign of assignments) {
      if (assign.applicationId && (assign.applicationId as any).companyId) {
        assign.companyId = (assign.applicationId as any).companyId;
        await assign.save();
        assignCount++;
      }
    }
    console.log(`Migrated ${assignCount} assignments`);

    // 8. Scorecards -> Interview -> CompanyId
    const scorecards = await Scorecard.find({ companyId: { $exists: false } }).populate('interview');
    let scoreCount = 0;
    for (const score of scorecards) {
      if (score.interview && (score.interview as any).companyId) {
        score.companyId = (score.interview as any).companyId;
        await score.save();
        scoreCount++;
      }
    }
    console.log(`Migrated ${scoreCount} scorecards`);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
