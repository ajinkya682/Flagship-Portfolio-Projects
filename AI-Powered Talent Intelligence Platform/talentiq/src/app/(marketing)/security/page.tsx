import { LegalLayout } from "@/components/marketing/LegalLayout"

export default function SecurityPage() {
  return (
    <LegalLayout title="Security" lastUpdated="November 20, 2023">
      <p>
        Security is at the core of everything we build at TalentIQ. We employ industry-leading security practices to protect your data and ensure the continuous availability of our platform.
      </p>

      <h2>1. Certifications & Compliance</h2>
      <p>
        We undergo regular third-party audits to validate our security controls.
      </p>
      <ul>
        <li><strong>SOC 2 Type II:</strong> TalentIQ is SOC 2 Type II certified. Our auditor's report is available to enterprise customers under NDA.</li>
        <li><strong>ISO 27001:</strong> We maintain an Information Security Management System (ISMS) aligned with ISO 27001 standards.</li>
      </ul>

      <h2>2. Data Protection</h2>
      <p>
        We use state-of-the-art encryption to protect your data at all times.
      </p>
      <ul>
        <li><strong>In Transit:</strong> All data transmitted between clients and our servers is encrypted using TLS 1.2 or higher.</li>
        <li><strong>At Rest:</strong> All databases and backups are encrypted at rest using AES-256 encryption.</li>
      </ul>

      <h2>3. Access Control</h2>
      <p>
        We strictly limit access to production environments.
      </p>
      <ul>
        <li>Employee access to production infrastructure is restricted via Role-Based Access Control (RBAC) and requires Multi-Factor Authentication (MFA).</li>
        <li>We adhere to the principle of least privilege.</li>
      </ul>

      <h2>4. Vulnerability Management</h2>
      <p>
        We continuously monitor our infrastructure for potential threats. We run automated static and dynamic analysis (SAST/DAST) during our CI/CD pipelines, perform regular external penetration testing, and maintain an active bug bounty program.
      </p>
    </LegalLayout>
  )
}
