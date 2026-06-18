import connectToDatabase from './src/core/database/mongoose';
import { Company } from './src/core/database/models/Company';
import { User } from './src/core/database/models/User';

async function check() {
  await connectToDatabase();
  const user = await User.findOne({ email: 'user1@gmail.com' });
  console.log('User plan:', user?.plan);
  
  if (user?.company) {
    const company = await Company.findById(user.company);
    console.log('Company billing:', company?.billing);
  }
  process.exit(0);
}

check();
