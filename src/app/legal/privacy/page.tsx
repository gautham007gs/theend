
// src/app/legal/privacy/page.tsx
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PrivacyPolicyPage = () => {
  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background shadow-2xl">
      <AppHeader title="Privacy Policy" />
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Privacy Policy for Kruthika.fun</CardTitle>
            <CardDescription>Last Updated: January 15, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to Kruthika.fun (the "Service"), an AI girlfriend companion application operated by Kruthika Technologies ("we", "us", or "our").
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI companion service.
                By using the Service, you agree to the collection and use of information in accordance with this policy.
              </p>
              <p className="text-muted-foreground mt-2">
                The character "Kruthika" you interact with is an Artificial Intelligence (AI) language model powered by Google's Vertex AI.
                Your interactions are with this AI and are not with a real human. We prioritize your privacy and data security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">2. Information Collection and Use</h2>
              <p className="text-muted-foreground">
                We collect information to provide, improve, and personalize our Service. Our data collection includes:
              </p>
              
              <h3 className="text-lg font-medium mt-3 mb-1">2.1 Chat Data & AI Interaction</h3>
              <p className="text-muted-foreground">
                Your messages are processed through Google's Vertex AI (Gemini model) to generate personalized AI companion responses.
                Messages and any uploaded images are transmitted securely to Google's servers for processing and are subject to Google's AI privacy policies.
                We implement advanced encryption to protect your conversations during transmission.
              </p>
              <p className="text-muted-foreground mt-1">
                Chat history is stored locally in your browser's localStorage for session continuity. No detailed conversations
                are permanently stored on our servers. Chat data is automatically purged after 24 hours for your privacy protection.
                Uploaded images are processed for AI response generation but are not permanently stored.
              </p>
              
              <h3 className="text-lg font-medium mt-3 mb-1">2.2 Enhanced Analytics Data</h3>
              <p className="text-muted-foreground">
                With your consent, we collect comprehensive analytics through Supabase including:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li>Real-time user engagement metrics (message counts, session duration, response patterns)</li>
                <li>AI performance data (response times, conversation quality metrics, user satisfaction scores)</li>
                <li>Device and browser information for optimization purposes</li>
                <li>Anonymized user journey data to improve the experience</li>
                <li>Ad interaction metrics (impressions, clicks, viewability) for revenue optimization</li>
                <li>Peak usage patterns and geographical distribution (anonymized)</li>
              </ul>

              <h3 className="text-lg font-medium mt-3 mb-1">2.3 Advanced Cookie System</h3>
              <p className="text-muted-foreground">
                Our enhanced cookie system includes multiple categories:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li><strong>Necessary Cookies:</strong> Essential for basic functionality (365 days)</li>
                <li><strong>Analytics Cookies:</strong> Performance and usage tracking (90 days)</li>
                <li><strong>Advertising Cookies:</strong> Ad personalization and revenue optimization (30 days)</li>
                <li><strong>Personalization Cookies:</strong> Chat preferences and user customization (180 days)</li>
                <li><strong>AI Learning Cookies:</strong> Conversation style adaptation and personality tuning (365 days)</li>
                <li><strong>Intimacy Level Cookies:</strong> Relationship progression tracking (30 days, secure)</li>
              </ul>

              <h3 className="text-lg font-medium mt-3 mb-1">2.4 Monetization Data</h3>
              <p className="text-muted-foreground">
                We collect advertising performance data including ad impressions, click-through rates, viewability metrics,
                and revenue analytics to optimize our ad placement strategy. This data is used to improve user experience
                while maintaining sustainable revenue streams.
              </p>

              <h3 className="text-lg font-medium mt-3 mb-1">2.5 Personal Data (Future Implementation)</h3>
              <p className="text-muted-foreground">
                Currently, Kruthika.fun operates without user accounts to protect your anonymity. If we implement optional
                user accounts in the future, we would collect minimal data such as email addresses, with enhanced privacy protections.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">3. Use of Your Information</h2>
              <p className="text-muted-foreground">
                We use collected information for:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li>Providing and operating the AI companion service</li>
                <li>Personalizing AI responses and conversation style</li>
                <li>Analyzing user engagement and improving service quality</li>
                <li>Generating AI responses through Google's Vertex AI</li>
                <li>Optimizing website performance and user experience</li>
                <li>Real-time analytics and dashboard reporting (admin only)</li>
                <li>Ad optimization and revenue generation</li>
                <li>Preventing abuse and ensuring service security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">4. Advanced Cookie Management</h2>
              <p className="text-muted-foreground">
                Our cookie system provides granular control over data collection:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li><strong>Dynamic Consent:</strong> Modify your cookie preferences at any time</li>
                <li><strong>AI Personality Learning:</strong> Opt-in to allow AI to learn and adapt to your conversation style</li>
                <li><strong>Performance Optimization:</strong> Automated cookie compression and cleanup</li>
                <li><strong>Revenue Optimization:</strong> Smart ad timing based on your engagement patterns</li>
                <li><strong>Real-time Analytics:</strong> Live performance monitoring with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">5. Data Sharing and Third-Party Services</h2>
              <p className="text-muted-foreground">
                We share data with the following third-party services:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li><strong>Google Vertex AI:</strong> Chat messages and images for AI response generation</li>
                <li><strong>Supabase:</strong> Analytics data storage and real-time dashboard functionality</li>
                <li><strong>Adsterra/Monetag:</strong> Ad serving and performance tracking (with consent)</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">6. Data Retention and Security</h2>
              <p className="text-muted-foreground">
                <strong>Chat Data:</strong> Stored locally in browser, automatically deleted after 24 hours<br/>
                <strong>Analytics Data:</strong> Retained according to Supabase policies for trend analysis<br/>
                <strong>Cookies:</strong> Vary by category (30-365 days) with automatic cleanup<br/>
                <strong>AI Processing:</strong> Subject to Google's Vertex AI retention policies
              </p>
              <p className="text-muted-foreground mt-2">
                We implement industry-standard security measures including HTTPS encryption, secure cookie settings,
                real-time monitoring, and regular security audits. However, no method of transmission or storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">7. Your Rights and Controls</h2>
              <p className="text-muted-foreground">
                You have the following rights:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li><strong>Access:</strong> View your data through browser developer tools</li>
                <li><strong>Deletion:</strong> Clear browser data to remove local storage</li>
                <li><strong>Cookie Control:</strong> Manage consent preferences at any time</li>
                <li><strong>AI Learning Opt-out:</strong> Disable personality adaptation features</li>
                <li><strong>Analytics Opt-out:</strong> Refuse analytics data collection</li>
                <li><strong>Ad Personalization:</strong> Control advertising cookie usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">8. Age Restrictions and Safety</h2>
              <p className="text-muted-foreground">
                Our Service is intended for users 18 years and older. We do not knowingly collect data from minors under 18.
                The service includes mature conversational content and is designed for adult users seeking AI companionship.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">9. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your data may be processed in the United States, India, and other countries where our service providers operate.
                We ensure appropriate safeguards are in place for international data transfers, including Google's global
                infrastructure protections and Supabase's compliance frameworks.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">10. Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy to reflect changes in our practices or applicable law. Material changes
                will be communicated through the service interface. Your continued use constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">11. Contact Information</h2>
              <p className="text-muted-foreground">
                For privacy-related questions or requests, contact us at: privacy@kruthika.fun
              </p>
              <p className="text-muted-foreground">
                For data subject requests or cookie management assistance: support@kruthika.fun
              </p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 font-medium text-sm">
                  🔒 Privacy Commitment: Your intimate AI conversations are protected with enterprise-grade security.
                  We never share personal chat content for marketing purposes and maintain strict data minimization practices.
                </p>
              </div>
            </section>
            
            <div className="pt-4 flex justify-center">
              <Link href="/">
                <Button variant="outline">Back to Chats</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
