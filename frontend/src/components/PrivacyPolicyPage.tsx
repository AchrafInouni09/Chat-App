import { Link } from "react-router-dom";

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          <strong>Last updated:</strong> February 14, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Chat-App. We are committed to protecting your personal information 
            and your right to privacy. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Account Information:</strong> First name, last name, username, email address, and password (hashed)</li>
            <li><strong>Profile Information:</strong> Avatar, bio, and other optional profile details</li>
            <li><strong>Communications:</strong> Messages sent through our chat feature</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">Automatically Collected Information</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Usage data and activity logs</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-2">We use your information to:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Create and manage your account</li>
            <li>Provide and maintain our services</li>
            <li>Enable communication between users</li>
            <li>Process friend requests and manage relationships</li>
            <li>Send important notifications about your account</li>
            <li>Monitor and analyze usage patterns to improve our service</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p className="text-muted-foreground mb-2">We implement industry-standard security measures including:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Password hashing using bcrypt</li>
            <li>JWT-based authentication</li>
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure database storage with MySQL</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
          <p className="text-muted-foreground mb-2">We do not sell your personal information. We may share your information only:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>With other users as part of the application's social features (e.g., your public profile)</li>
            <li>When required by law or legal process</li>
            <li>To protect our rights, privacy, safety, or property</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-muted-foreground mb-2">You have the right to:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and local storage to maintain your session and preferences. 
            You can control cookie settings through your browser.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our service is not intended for users under 13 years of age. We do not knowingly 
            collect information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any 
            changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-muted-foreground mb-2">If you have questions about this Privacy Policy, please contact us at:</p>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Email: privacy@chatapp.com</li>
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

export default PrivacyPolicyPage;
