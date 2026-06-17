import { LegalLayout } from "@/components/marketing/LegalLayout"

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="October 12, 2023">
      <p>
        At TalentIQ, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our platform.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:
      </p>
      <ul>
        <li>Name, email address, and contact information.</li>
        <li>Professional history, resumes, and portfolio links.</li>
        <li>Payment and billing information.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <p>
        We use the information we collect to provide, maintain, and improve our services. Specifically, we use it to:
      </p>
      <ul>
        <li>Process applications and match candidates with jobs using our AI algorithms.</li>
        <li>Communicate with you about updates, security alerts, and support messages.</li>
        <li>Protect against fraudulent or illegal activity.</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>
        We do not sell your personal data. We may share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
      </p>
    </LegalLayout>
  )
}
