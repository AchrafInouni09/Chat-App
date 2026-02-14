import { Link } from "react-router-dom";

function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          <strong>Last updated:</strong> February 14, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using Chat-App ("the Service"), you agree to be bound by these 
            Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground mb-2">Chat-App is a social web application that provides:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>User account management and profiles</li>
            <li>Real-time messaging and chat functionality</li>
            <li>Friend system and social connections</li>
            <li>Post creation and social feed</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <h3 className="text-xl font-medium mb-2">Registration</h3>
          <p className="text-muted-foreground mb-2">To use the Service, you must:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>Provide accurate and complete registration information</li>
            <li>Be at least 13 years of age</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">Account Responsibilities</h3>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for all activities that occur under your account. 
            We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
          <p className="text-muted-foreground mb-2">You agree NOT to:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Use the Service for any illegal purpose</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Post content that is defamatory, obscene, or offensive</li>
            <li>Impersonate any person or entity</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Collect user information without consent</li>
            <li>Transmit viruses, malware, or malicious code</li>
            <li>Spam or send unsolicited messages</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
          <h3 className="text-xl font-medium mb-2">Ownership</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You retain ownership of content you create and post. By posting content, 
            you grant us a non-exclusive license to use, display, and distribute your 
            content within the Service.
          </p>

          <h3 className="text-xl font-medium mb-2">Content Guidelines</h3>
          <p className="text-muted-foreground leading-relaxed">
            All content must comply with these Terms and applicable laws. 
            We may remove content that violates these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your use of the Service is also governed by our{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>, 
            which is incorporated into these Terms by reference.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Service and its original content, features, and functionality are owned 
            by Chat-App and are protected by international copyright, trademark, and 
            other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Disclaimers</h2>
          <p className="text-muted-foreground leading-relaxed uppercase text-sm">
            The Service is provided "as is" and "as available" without warranties of 
            any kind, express or implied. We do not guarantee that the Service will 
            be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed uppercase text-sm">
            To the maximum extent permitted by law, Chat-App shall not be liable for 
            any indirect, incidental, special, consequential, or punitive damages 
            arising from your use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to indemnify and hold harmless Chat-App and its team members 
            from any claims, damages, or expenses arising from your use of the Service 
            or violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Modifications to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify these Terms at any time. We will notify 
            users of significant changes. Continued use of the Service after changes 
            constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may terminate or suspend your account at any time for violations of 
            these Terms. You may also delete your account at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms shall be governed by and construed in accordance with 
            applicable laws, without regard to conflict of law principles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
          <p className="text-muted-foreground mb-2">For questions about these Terms, please contact us at:</p>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Email: legal@chatapp.com</li>
          </ul>
        </section>

        <div className="mt-12 pt-6 border-t border-border">
          <Link to="/login" className="text-primary hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsOfServicePage;
