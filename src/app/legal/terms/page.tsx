
// src/app/legal/terms/page.tsx
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background shadow-2xl">
      <AppHeader title="Terms of Service" />
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Terms of Service - Kruthika.fun</CardTitle>
            <CardDescription>Last Updated: January 15, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                Welcome to Kruthika.fun ("the Service"), an AI girlfriend companion application operated by Kruthika Technologies. 
                These Terms of Service ("Terms") govern your use of our AI companion services, analytics features, and monetization systems.
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these terms, 
                you may not access the Service.
              </p>
              <p className="text-muted-foreground mt-2">
                The character "Kruthika" is an Artificial Intelligence powered by Google's Vertex AI (Gemini model).
                All interactions are simulated conversations with advanced AI technology, not with a real human being.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">2. Service Description and AI Limitations</h2>
              <p className="text-muted-foreground">
                Kruthika.fun provides an AI companion experience designed for entertainment, emotional support, and companionship.
                The Service includes:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li>Real-time AI conversations with personality adaptation</li>
                <li>Image sharing and multimedia interactions</li>
                <li>Personalized conversation styles and preferences</li>
                <li>Analytics and engagement tracking (with consent)</li>
                <li>Advertising-supported free access</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                The Service is NOT intended to provide professional advice of any kind, including but not limited to:
                medical, legal, financial, therapeutic, crisis intervention, or mental health services.
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 font-medium">⚠️ Important Safety Notice:</p>
                <p className="text-red-700 text-sm">
                  If you are experiencing a mental health crisis or emergency, immediately contact emergency services 
                  or a crisis helpline in your area. This AI service cannot provide emergency assistance or replace 
                  professional mental health care.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">3. Age Requirements and Content Warning</h2>
              <p className="text-muted-foreground">
                <strong>Minimum Age:</strong> Users must be at least 18 years old to use this service. The Service contains
                mature conversational content, romantic themes, and adult-oriented AI companionship features designed for adult users.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Content Nature:</strong> Conversations may include romantic, flirtatious, or intimate themes as part of
                the AI girlfriend experience. Users consent to this type of content by using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">4. Prohibited Uses & User Conduct</h2>
              <p className="text-muted-foreground">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                <li>Share illegal, harmful, threatening, abusive, harassing, or defamatory content</li>
                <li>Attempt to extract training data, reverse engineer AI models, or compromise system security</li>
                <li>Share personal information of others without consent or violate privacy rights</li>
                <li>Circumvent safety measures, content filters, or cookie consent mechanisms</li>
                <li>Use automated systems to manipulate analytics, ad interactions, or engagement metrics</li>
                <li>Impersonate any person or entity, or misrepresent your relationship with any entity</li>
                <li>Use the service for commercial purposes without authorization</li>
                <li>Attempt to create multiple accounts to manipulate metrics or abuse free services</li>
                <li>Interfere with real-time analytics, performance monitoring, or admin systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">5. Cookie Consent and Data Processing</h2>
              <p className="text-muted-foreground">
                By using the Service, you acknowledge our advanced cookie system and consent mechanisms:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li><strong>Granular Consent:</strong> You can control different categories of cookies separately</li>
                <li><strong>AI Learning:</strong> Optional consent for personality adaptation and conversation improvement</li>
                <li><strong>Analytics Tracking:</strong> Detailed engagement and performance monitoring with your permission</li>
                <li><strong>Ad Personalization:</strong> Revenue optimization through targeted advertising (opt-in)</li>
                <li><strong>Real-time Processing:</strong> Live analytics for service improvement and admin monitoring</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">6. Monetization and Advertising</h2>
              <p className="text-muted-foreground">
                The Service is supported by advertising revenue through partnerships with Adsterra, Monetag, and other networks.
                By using the Service, you acknowledge:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li>Ads may be displayed during your conversation experience</li>
                <li>Ad frequency and timing are optimized based on engagement patterns (with consent)</li>
                <li>Ad interactions are tracked for performance analytics and revenue optimization</li>
                <li>You can control ad personalization through cookie consent settings</li>
                <li>Ad revenue supports the free availability of the AI companion service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">7. AI Response Accuracy and Content Disclaimer</h2>
              <p className="text-muted-foreground">
                AI-generated content is provided "as is" for entertainment and companionship purposes only. We do not guarantee 
                the accuracy, completeness, reliability, or appropriateness of any AI responses. Users must verify 
                all information independently before making any decisions based on AI-generated content.
              </p>
              <p className="text-muted-foreground mt-2">
                The AI may occasionally produce unexpected, inappropriate, or factually incorrect responses despite our safety filters.
                Please report concerning content immediately through appropriate channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">8. Data Security and Third-Party Services</h2>
              <p className="text-muted-foreground">
                Your data may be processed by third-party services including:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li><strong>Google Vertex AI:</strong> For AI response generation and processing</li>
                <li><strong>Supabase:</strong> For analytics data storage and real-time dashboard functionality</li>
                <li><strong>Advertising Networks:</strong> For ad serving and performance tracking</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                While we implement security measures, you acknowledge that internet transmission carries inherent risks
                and that no system is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">9. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service, including the AI character "Kruthika," original content, features, analytics systems, and functionality 
                are and will remain the exclusive property of Kruthika Technologies and its licensors. Users retain rights to 
                their input messages but grant us license to process them for AI response generation and service improvement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">10. Service Availability and Performance</h2>
              <p className="text-muted-foreground">
                We strive to maintain high service availability and performance, monitored through our real-time analytics dashboard.
                However, we do not guarantee uninterrupted service and may perform maintenance, updates, or experience technical issues.
                AI response times, server performance, and analytics accuracy may vary based on technical conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">11. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Kruthika Technologies shall not be liable for any direct, indirect, incidental, consequential, or punitive damages 
                arising from your use of the service, including but not limited to:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground">
                <li>Emotional distress or psychological effects from AI interactions</li>
                <li>Loss of data, privacy breaches, or security incidents</li>
                <li>Advertising-related issues or third-party service problems</li>
                <li>AI response accuracy, appropriateness, or harmful content</li>
                <li>Analytics data accuracy or performance metrics</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                The service is provided on an "as is" and "as available" basis without warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">12. Termination and Account Management</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend access to the service immediately, without prior notice, for conduct 
                that violates these Terms, manipulates analytics or ad systems, or is harmful to other users or our business operations.
                Upon termination, your access to analytics data and personalized AI features will cease.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">13. Governing Law and Dispute Resolution</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by the laws of India and California, USA, without regard to conflict of law provisions.
                Any disputes shall be resolved through binding arbitration. For users in the European Union, applicable data protection
                laws will also apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">14. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. Material changes will be communicated through the service
                interface with at least 30 days' notice. Your continued use constitutes acceptance of the updated Terms.
                Changes to privacy practices or monetization strategies will require separate consent where legally required.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">15. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms: legal@kruthika.fun
              </p>
              <p className="text-muted-foreground">
                For immediate support or safety concerns: support@kruthika.fun
              </p>
              <p className="text-muted-foreground">
                For analytics or technical issues: admin@kruthika.fun
              </p>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-medium text-sm">
                  ✅ Service Commitment: We're committed to providing a safe, engaging, and transparent AI companion experience
                  with clear privacy controls and honest monetization practices.
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

export default TermsOfServicePage;
