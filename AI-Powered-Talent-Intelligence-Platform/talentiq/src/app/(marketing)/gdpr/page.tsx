import { LegalLayout } from "@/components/marketing/LegalLayout"

export default function GDPRPage() {
  return (
    <LegalLayout title="GDPR Compliance" lastUpdated="January 15, 2024">
      <p>
        TalentIQ is fully committed to compliance with the General Data Protection Regulation (GDPR). We ensure that the personal data of our users and their candidates in the European Union is handled with the highest standards of privacy and security.
      </p>

      <h2>1. Our Role</h2>
      <p>
        Under the GDPR, TalentIQ generally acts as a <strong>Data Processor</strong> when processing candidate data on behalf of our customers (the Data Controllers). For our direct users, we act as a <strong>Data Controller</strong> regarding their account information.
      </p>

      <h2>2. Data Subject Rights</h2>
      <p>
        We provide tools to help our customers fulfill data subject requests, including:
      </p>
      <ul>
        <li><strong>Right to Access:</strong> Candidates can request copies of their personal data.</li>
        <li><strong>Right to Rectification:</strong> Inaccurate data can be corrected immediately.</li>
        <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Customers can permanently delete candidate profiles upon request.</li>
        <li><strong>Right to Data Portability:</strong> Data can be exported in machine-readable formats.</li>
      </ul>

      <h2>3. Data Processing Agreement (DPA)</h2>
      <p>
        We offer a comprehensive Data Processing Agreement (DPA) incorporating Standard Contractual Clauses (SCCs) for our enterprise customers. To request a signed copy, please contact our legal team at <a href="mailto:legal@talentiq.com">legal@talentiq.com</a>.
      </p>

      <h2>4. Security Measures</h2>
      <p>
        We implement robust technical and organizational measures to ensure a level of security appropriate to the risk, including encryption at rest and in transit, strict access controls, and regular vulnerability scanning.
      </p>
    </LegalLayout>
  )
}
