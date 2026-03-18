import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
        <h1 className="text-white font-bold text-lg">Privacy Policy</h1>
      </div>

      <div className="px-5 pt-6 max-w-lg mx-auto space-y-6 text-sm leading-relaxed">
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Last updated: March 2026</p>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Overview</h2>
          <p>Caffiend ("we", "our", "the app") is a caffeine tracking application. We are committed to protecting your privacy. This policy explains what data we collect and how we use it.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Data We Collect</h2>
          <p className="mb-2"><strong className="text-white">Data stored only on your device (never sent to us):</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your caffeine intake log (drinks, timestamps, amounts)</li>
            <li>Your settings (body weight, sleep time, daily limit)</li>
            <li>Your Pro subscription status</li>
          </ul>
          <p className="mt-3">All of this data is stored exclusively in your browser's localStorage. It never leaves your device and is never transmitted to our servers.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Data We Do Not Collect</h2>
          <p>We do not collect, store, or process:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Your name, email address, or any personal identifiers</li>
            <li>Your location</li>
            <li>Device identifiers</li>
            <li>Usage analytics or crash reports</li>
            <li>Any health or biometric data beyond what you voluntarily enter</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Barcode Scanning</h2>
          <p>The barcode scanner (Pro feature) uses your device camera solely to read barcodes. Camera access is not recorded, stored, or transmitted. Product lookup queries are sent to the Open Food Facts API (a public database) to retrieve caffeine information.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Payments</h2>
          <p>Pro subscriptions are processed by Stripe. Caffiend does not receive or store your payment card details. Please review <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24' }}>Stripe's Privacy Policy</a> for details on how payment data is handled.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Third-Party Services</h2>
          <p>Caffiend uses the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong className="text-white">Open Food Facts</strong> — public food database for barcode lookups (no account required)</li>
            <li><strong className="text-white">Stripe</strong> — payment processing for Pro subscriptions</li>
            <li><strong className="text-white">Google Fonts</strong> — font loading (JetBrains Mono, Inter)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Data Deletion</h2>
          <p>Since all data is stored locally on your device, you can delete it at any time by clearing your browser's site data or uninstalling the app. We have no server-side copy to delete.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">8. Children's Privacy</h2>
          <p>Caffiend is not directed at children under 13. We do not knowingly collect data from children.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">9. Changes to This Policy</h2>
          <p>We may update this policy occasionally. Changes will be reflected with an updated date at the top of this page.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">10. Contact</h2>
          <p>Questions about this policy? Contact us at <span style={{ color: '#fbbf24' }}>hello@caffiend.app</span></p>
        </section>
      </div>
    </div>
  );
}
