import { LegalLayout } from "@/components/marketing/LegalLayout"

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="September 5, 2023">
      <p>
        Welcome to TalentIQ! By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By creating an account or using our services, you confirm that you have read, understood, and agree to these terms. If you do not agree, you may not use our services.
      </p>

      <h2>2. User Accounts</h2>
      <p>
        You are responsible for maintaining the security of your account credentials. You must promptly notify us of any unauthorized use or security breaches.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>
        You agree not to use TalentIQ to:
      </p>
      <ul>
        <li>Upload malicious code or attempt to compromise the integrity of our platform.</li>
        <li>Scrape or extract data without explicit authorization.</li>
        <li>Discriminate against candidates in violation of applicable employment laws.</li>
      </ul>

      <h2>4. Intellectual Property</h2>
      <p>
        All content on TalentIQ, including software, design, text, and graphics, is the property of TalentIQ or our licensors and is protected by intellectual property laws.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        TalentIQ provides its services "as is" and without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
      </p>
    </LegalLayout>
  )
}
