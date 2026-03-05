export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-12">

      

        {/* Main Content */}
        <article className="md:col-span-3">

          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Privacy <span className="text-yellow-500">Policy</span>
          </h1>

          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-12">
            Last Updated: March 2026
          </p>

          <div className="space-y-12 text-slate-700 leading-relaxed">

            {/* Overview */}
            <section id="overview">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                1. Overview
              </h2>
              <p>
                Talentbees ("we", "our", or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect,
                use, store, and protect your personal information when you
                use our platform, including job searching, recruitment
                services, and employer tools.
              </p>
            </section>

            {/* Information Collection */}
            <section id="information">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                2. Information We Collect
              </h2>

              <p>
                When you use Talentbees, we may collect the following
                categories of information:
              </p>

              <ul className="list-disc ml-6 mt-4 space-y-2">
                <li>Personal details such as name, email, and phone number</li>
                <li>Professional details including resume, experience, and education</li>
                <li>Job preferences, skills, and career interests</li>
                <li>Technical data such as IP address, browser type, and device information</li>
                <li>Usage data including interactions with job listings and employer pages</li>
              </ul>
            </section>

            {/* Usage */}
            <section id="usage">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                3. How We Use Your Information
              </h2>

              <p>Your information helps us operate and improve our services.</p>

              <ul className="list-disc ml-6 mt-4 space-y-2">
                <li>Provide job matching and recruitment services</li>
                <li>Allow employers to review candidate profiles</li>
                <li>Improve platform performance and user experience</li>
                <li>Send job alerts and notifications</li>
                <li>Maintain platform security and prevent fraud</li>
              </ul>
            </section>

            {/* Sharing */}
            <section id="sharing">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                4. Information Sharing
              </h2>

              <p>
                We do not sell personal data. However, information may be
                shared with:
              </p>

              <ul className="list-disc ml-6 mt-4 space-y-2">
                <li>Employers reviewing job applications</li>
                <li>Service providers supporting our infrastructure</li>
                <li>Authorities when required by law</li>
              </ul>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                5. Cookies and Tracking
              </h2>

              <p>
                Talentbees uses cookies and similar technologies to improve
                user experience, remember preferences, and analyze platform
                performance.
              </p>
            </section>

            {/* Security */}
            <section id="security">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                6. Data Security
              </h2>

              <p>
                We implement industry-standard security measures to protect
                user data, including encrypted communication and controlled
                access to sensitive information.
              </p>
            </section>

            {/* Rights */}
            <section id="rights">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                7. Your Rights
              </h2>

              <p>You may have the right to:</p>

              <ul className="list-disc ml-6 mt-4 space-y-2">
                <li>Access or update your personal information</li>
                <li>Request deletion of your account</li>
                <li>Withdraw consent for marketing communication</li>
              </ul>
            </section>

            {/* Contact */}
            <section id="contact">
              <h2 className="text-xl font-black text-slate-900 mb-3">
                8. Contact Us
              </h2>

              <p>
                If you have questions regarding this Privacy Policy, please
                contact us at:
              </p>

              <p className="mt-3 font-medium">
                Email: support@talentbees.com
              </p>
            </section>

          </div>
        </article>
      </div>
    </div>
  );
}