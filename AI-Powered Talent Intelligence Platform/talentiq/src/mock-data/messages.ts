// ─── Mock Messages — realistic multi-turn conversations ─────────────

export interface MockMessage {
  id: string
  candidateId: string
  senderId: string // 'me' or candidateId
  text: string
  time: string
}

const now = new Date()
const fmt = (h: number, m: number, daysAgo = 0, am = true) => {
  const d = new Date(now)
  d.setDate(d.getDate() - daysAgo)
  return `${d.toLocaleDateString('en-US', { weekday: 'long' })} ${h}:${m === 0 ? '00' : m} ${am ? 'AM' : 'PM'}`
}

export const MOCK_MESSAGES: MockMessage[] = [
  // ── Conversation with Jennifer Park (c_1) ─────────────────────
  { id: 'm_1', candidateId: 'c_1', senderId: 'c_1', text: "Hi Sarah, I received your LinkedIn message about the Senior Software Engineer role at Acme Corp. I'm very interested — the distributed systems work sounds exactly like what I've been looking for.", time: fmt(9, 0, 3) },
  { id: 'm_2', candidateId: 'c_1', senderId: 'me', text: "Hi Jennifer! So glad to hear you're interested. Your background at Google and Stripe is exactly what we're looking for. I reviewed your profile and your experience with high-throughput systems aligns perfectly.", time: fmt(9, 15, 3) },
  { id: 'm_3', candidateId: 'c_1', senderId: 'c_1', text: "That's great to hear! I'm particularly excited about the scale challenges. At Stripe I worked on systems processing millions of transactions per second. What does the tech stack look like?", time: fmt(9, 32, 3) },
  { id: 'm_4', candidateId: 'c_1', senderId: 'me', text: "We primarily use TypeScript, Node.js, and PostgreSQL on the backend with React on the frontend. We're also investing heavily in our data infrastructure with Kafka and Spark. Would you be available for a 30-min intro call this week?", time: fmt(10, 5, 3) },
  { id: 'm_5', candidateId: 'c_1', senderId: 'c_1', text: "Absolutely! I'm available Thursday afternoon or Friday morning. What works best for you?", time: fmt(10, 22, 3) },
  { id: 'm_6', candidateId: 'c_1', senderId: 'me', text: "Let's do Thursday at 2pm PT. I'll send a calendar invite. Looking forward to connecting!", time: fmt(10, 45, 3) },
  { id: 'm_7', candidateId: 'c_1', senderId: 'c_1', text: "Perfect, confirmed! One quick question — what's the team size and how would you describe the engineering culture?", time: fmt(11, 0, 2) },
  { id: 'm_8', candidateId: 'c_1', senderId: 'me', text: "The team is about 45 engineers split into 6 squads. Culture is very much ownership-driven — engineers are expected to own features end-to-end. We do design docs for major changes and have a strong code review culture. Very collaborative.", time: fmt(11, 30, 2) },
  { id: 'm_9', candidateId: 'c_1', senderId: 'c_1', text: "That sounds ideal. I've always thrived in environments that trust engineers with end-to-end ownership. See you Thursday!", time: fmt(11, 45, 2) },

  // ── Conversation with David Chen (c_2) ────────────────────────
  { id: 'm_10', candidateId: 'c_2', senderId: 'me', text: "Hi David! Mike Torres mentioned you as someone who might be a great fit for our Senior PM role. Your work at Airbnb on the host product sounds very relevant. Are you currently exploring new opportunities?", time: fmt(2, 0, 5, false) },
  { id: 'm_11', candidateId: 'c_2', senderId: 'c_2', text: "Hi Sarah! Yes, I've been passively exploring. I'm familiar with TalentIQ — actually used it at HubSpot. Really impressed with the AI scoring feature. Tell me more about the role.", time: fmt(4, 30, 5, false) },
  { id: 'm_12', candidateId: 'c_2', senderId: 'me', text: "That's amazing — great to hear from a user perspective! The role is for our core hiring workflow product. You'd own the roadmap for pipeline management, AI insights, and interview tooling. Full P&L ownership.", time: fmt(9, 15, 4) },
  { id: 'm_13', candidateId: 'c_2', senderId: 'c_2', text: "That's a compelling scope. What's the team structure? Do PMs at Acme have dedicated design and engineering resources?", time: fmt(10, 0, 4) },
  { id: 'm_14', candidateId: 'c_2', senderId: 'me', text: "Yes — each PM has 1 dedicated designer and a squad of 6–8 engineers. We use a 6-week planning cycle with 2-week sprints. Very autonomy-driven. Would you be open to jumping on a call this week?", time: fmt(10, 30, 4) },
  { id: 'm_15', candidateId: 'c_2', senderId: 'c_2', text: "Definitely. I'm free Tuesday or Wednesday afternoon. And I have to ask — what's the compensation range for this role?", time: fmt(11, 15, 4) },
  { id: 'm_16', candidateId: 'c_2', senderId: 'me', text: "The range is $150k–$185k base + equity + bonus depending on experience. Happy to discuss details on the call!", time: fmt(11, 45, 4) },
  { id: 'm_17', candidateId: 'c_2', senderId: 'c_2', text: "That works for me. Let's do Wednesday at 3pm. Looking forward to it!", time: fmt(12, 0, 4) },

  // ── Conversation with Emily Watson (c_3) ──────────────────────
  { id: 'm_18', candidateId: 'c_3', senderId: 'c_3', text: "Hi! I just submitted my application for the Senior Product Designer role. I'm very excited about this opportunity — I've been following TalentIQ's design evolution and have a lot of thoughts on where it could go.", time: fmt(10, 0, 20) },
  { id: 'm_19', candidateId: 'c_3', senderId: 'me', text: "Hi Emily! We're so glad you applied. Your portfolio is stunning — especially the design system work at Figma. We'd love to connect. Are you available for an intro call this week?", time: fmt(10, 45, 20) },
  { id: 'm_20', candidateId: 'c_3', senderId: 'c_3', text: "Thank you! Yes, happy to chat. Any day works for me — I'll fit my schedule around yours.", time: fmt(11, 0, 20) },
  { id: 'm_21', candidateId: 'c_3', senderId: 'me', text: "Wonderful. I have a calendar invite coming your way for tomorrow at 11am. Also — we loved the Dropbox checkout redesign case study. The 40% conversion improvement is remarkable.", time: fmt(11, 30, 20) },
  { id: 'm_22', candidateId: 'c_3', senderId: 'c_3', text: "Thank you so much! That project is one I'm most proud of. Happy to walk through the full story on the call. See you tomorrow!", time: fmt(11, 45, 20) },
  { id: 'm_23', candidateId: 'c_3', senderId: 'me', text: "Emily, congratulations! We're thrilled to extend you a formal offer. You were the unanimous choice from the entire panel. Details are in your email. 🎉", time: fmt(9, 0, 10) },
  { id: 'm_24', candidateId: 'c_3', senderId: 'c_3', text: "Oh wow, I'm absolutely thrilled! I've been hoping for this. I'll review the offer tonight and get back to you by tomorrow. Thank you for such an incredible process — everyone I met made me feel so welcome.", time: fmt(9, 30, 10) },

  // ── Additional conversations for other candidates ─────────────
  ...Array.from({ length: 150 }, (_, i) => {
    const cIdx = 4 + Math.floor(i / 3)
    const msgIdx = i % 3
    const candidateId = `c_${cIdx}`
    const messages = [
      { senderId: 'me', text: `Hi, I came across your profile and think you'd be a great fit for one of our open roles. Would you be open to a quick chat?` },
      { senderId: candidateId, text: `Hi! Yes, I'd be interested. Could you tell me more about the role and the company?` },
      { senderId: 'me', text: `Absolutely! Happy to set up a call. Would you be available this week for a 30-minute intro?` },
    ]
    const msg = messages[msgIdx]
    return {
      id: `m_${25 + i}`,
      candidateId,
      senderId: msg.senderId,
      text: msg.text,
      time: fmt(9 + (i % 8), (i % 4) * 15, Math.floor(i / 10)),
    }
  }),
]
