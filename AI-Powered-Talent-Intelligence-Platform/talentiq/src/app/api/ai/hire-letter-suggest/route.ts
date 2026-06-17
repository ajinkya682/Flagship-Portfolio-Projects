import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateName, role, salary, companyName, startDate, companyDetails } = body;

    const prompt = `
You are an expert HR professional and technical writer. Generate a professional, warm, and detailed hire letter for a new employee.

Company: ${companyName || 'the company'}
${companyDetails ? `Company Description: ${companyDetails}` : ''}
Candidate Name: ${candidateName || '[Candidate Name]'}
Role/Position: ${role}
Salary: $${salary} per year (USD)
Start Date: ${startDate ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '[Start Date]'}

Write a complete, professional hire letter including:
1. Opening congratulations and excitement about the candidate joining
2. Clear statement of the position being offered
3. Compensation details
4. Start date
5. Brief overview of what they can expect in their first weeks
6. Call to action (sign and return / accept)
7. Warm closing

The tone should be professional yet welcoming. Write in first-person from the company's perspective.
Return ONLY the letter content, no metadata. Start directly with "Dear ${candidateName || '[Candidate Name]'},"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text) {
      throw new Error('No content returned from Gemini');
    }

    return NextResponse.json({ content: response.text });
  } catch (error: any) {
    console.error('Hire letter AI generation error:', error);
    // Return a template fallback if AI fails
    const { candidateName, role, companyName, salary, startDate } = await req.json().catch(() => ({}));
    const fallback = `Dear ${candidateName || '[Candidate Name]'},

We are thrilled to extend this formal offer of employment to you for the position of ${role || '[Position]'} at ${companyName || '[Company Name]'}.

After a thorough review of your background and our conversations, we are confident that your skills and experience will be a tremendous asset to our team.

COMPENSATION & BENEFITS
• Annual Salary: $${salary ? Number(salary).toLocaleString() : '[Salary]'} (USD)
• Start Date: ${startDate ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '[Start Date]'}

YOUR FIRST WEEK
You will be welcomed by our onboarding team who will ensure you have everything you need to hit the ground running. Expect introductions to key team members, system access setup, and an overview of your first 30/60/90-day goals.

TO ACCEPT THIS OFFER
Please sign and return this letter by the acceptance deadline indicated. By signing, you confirm your acceptance of the terms and conditions outlined herein.

We are incredibly excited to have you join us and look forward to building something great together.

Warm regards,

[Hiring Manager Name]
[Title]
${companyName || '[Company Name]'}`;

    return NextResponse.json({ content: fallback });
  }
}
