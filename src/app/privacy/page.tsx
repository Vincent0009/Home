import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Privacy Policy</h1>
      
      <div className="space-y-6 text-slate-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Introduction</h2>
          <p>
            Welcome to our Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Information We Collect</h2>
          <p>
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, and other contact details you provide when contacting us.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our website, including IP addresses (which we hash for privacy), browser type, pages visited, and time spent on the site.
            </li>
            <li>
              <strong>Messages:</strong> Content you submit through our contact or message forms.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">How We Use Your Information</h2>
          <p>
            We use the collected information for various purposes:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. For example, we hash IP addresses to enhance privacy. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Cookies</h2>
          <p>
            We may use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Children&apos;s Privacy</h2>
          <p>
            Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;effective date&rdquo; at the top of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>By visiting our contact page</li>
            <li>By sending us an email</li>
          </ul>
        </section>

        <p className="text-sm text-slate-600 mt-8">
          Effective Date: July 19, 2025
        </p>
      </div>
    </div>
  );
}