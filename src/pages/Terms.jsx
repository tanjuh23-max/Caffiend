import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-10" style={{ background: '#060608', color: 'rgba(255,255,255,0.75)' }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3 sticky top-0 z-10"
        style={{ background: '#060608', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <ArrowLeft size={17} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">Terms of Service</h1>
      </div>

      <div className="px-5 pt-6 max-w-lg mx-auto space-y-6 text-sm leading-relaxed">
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Last updated: March 2026</p>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Acceptance of Terms</h2>
          <p>By using Caffiend, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Description of Service</h2>
          <p>Caffiend is a caffeine tracking application that models caffeine metabolism using pharmacokinetic principles. It provides estimates of active caffeine levels based on data you input. The app is available as a free web app with an optional Pro subscription.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Not Medical Advice</h2>
          <p>Caffiend is for informational and wellness purposes only. It is <strong className="text-white">not a medical device</strong> and does not provide medical advice, diagnosis, or treatment. Caffeine sensitivity varies between individuals. Always consult a qualified healthcare professional before making decisions about your diet or caffeine consumption, especially if you have a medical condition.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Pro Subscription</h2>
          <p className="mb-2">The Pro tier unlocks additional features including barcode scanning and unlimited history.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pro is billed at £9.99/month or £59.99/year via Stripe</li>
            <li>You may cancel at any time through your Stripe billing portal</li>
            <li>Refunds are handled on a case-by-case basis — contact us within 14 days of purchase</li>
            <li>Pro status is stored locally on your device. If you clear your data, use the "Restore Purchase" option in Settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Accuracy of Data</h2>
          <p>Caffeine content figures in the app are based on published averages and third-party databases. Actual caffeine content of individual beverages may vary. Caffiend makes no guarantee of the accuracy of these figures.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. User Responsibilities</h2>
          <p>You are responsible for the accuracy of data you enter into the app. You agree not to misuse the app or attempt to reverse-engineer, copy, or redistribute it without permission.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Intellectual Property</h2>
          <p>All content, design, and code within Caffiend is the property of its creators and is protected by copyright. You may not reproduce or distribute any part of it without written permission.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Caffiend and its creators are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the app, including any health-related decisions made based on the app's estimates.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">9. Availability</h2>
          <p>We aim to keep Caffiend available at all times but cannot guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue the app at any time.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">10. Governing Law</h2>
          <p>These terms are governed by the laws of England and Wales.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">11. Contact</h2>
          <p>Questions about these terms? Contact us at <span style={{ color: '#fbbf24' }}>hello@caffiend.app</span></p>
        </section>
      </div>
    </div>
  );
}
