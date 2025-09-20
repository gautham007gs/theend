
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
            <CardDescription>Last Updated: September 20, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                Welcome to Kruthika.fun ("the Service"). These Terms of Service ("Terms") govern your use of our
                AI girlfriend companion application and services operated by Kruthika Technologies. By accessing or using the Service, 
                you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className="text-muted-foreground mt-2">
                The character "Kruthika" you interact with is an Artificial Intelligence (AI) language model.
                All interactions are simulated conversations with AI technology, not with a real human being.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">2. AI Service Limitations</h2>
              <p className="text-muted-foreground">
                You acknowledge that "Kruthika" is an AI assistant designed for entertainment and general conversation. 
                The Service is NOT intended to provide professional advice of any kind, including but not limited to:
                medical, legal, financial, therapeutic, or crisis intervention services.
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 font-medium">⚠️ Important Safety Notice:</p>
                <p className="text-red-700 text-sm">
                  If you are experiencing a mental health crisis or emergency, immediately contact emergency services 
                  or a crisis helpline in your area. This AI service cannot provide emergency assistance.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">3. Prohibited Uses & User Conduct</h2>
              <p className="text-muted-foreground">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                <li>Transmit content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Attempt to elicit harmful, illegal, or inappropriate responses from the AI</li>
                <li>Share personal information of others without consent</li>
                <li>Attempt to circumvent safety measures or content filters</li>
                <li>Use the service for commercial purposes without authorization</li>
                <li>Impersonate any person or entity</li>
                <li>Attempt to extract training data or reverse engineer the AI model</li>
                <li>Use the service to generate content that violates intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">4. Content & Accuracy Disclaimer</h2>
              <p className="text-muted-foreground">
                AI-generated content is provided "as is" for entertainment purposes only. We do not guarantee 
                the accuracy, completeness, reliability, or appropriateness of any AI responses. Users must verify 
                all information independently before making any decisions based on AI-generated content.
              </p>
              <p className="text-muted-foreground mt-2">
                We implement content moderation and safety filters, but AI responses may sometimes be unexpected 
                or inappropriate. Please report any concerning content immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">5. Age Restrictions & Safety</h2>
              <p className="text-muted-foreground">
                Users must be at least 13 years old to use this service. Users under 18 should have parental 
                guidance and supervision when using AI chat services. Parents and guardians are responsible 
                for monitoring their children's use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">6. Privacy & Data Protection</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your information. By using the service, you consent to our data practices as 
                described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Kruthika Technologies shall not be liable for any direct, indirect, incidental, consequential, 
                or punitive damages arising from your use of the service. The service is provided on an "as is" 
                and "as available" basis without warranties of any kind. Users acknowledge this is an AI simulation service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">8. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend access to the service immediately, without prior 
                notice, for conduct that we believe violates these Terms or is harmful to other users or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of significant 
                changes via the service interface. Your continued use of the service after changes constitutes 
                acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">10. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us through the appropriate channels 
                provided in the application interface.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service and its original content (excluding content provided by users or generated by the AI based on user input),
                features, and functionality are and will remain the exclusive property of [Your Company Name/Your Name] and its licensors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">6. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall Kruthika Technologies, nor its directors, employees, partners, agents,
                suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or
                punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your access to or use of or inability to access or use the Service.
                This includes any emotional distress or attachment that may result from AI interactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">8. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed and construed in accordance with the laws of India and California, USA,
                without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will try to provide at least 30 days' notice prior to any new
                terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-4 mb-2">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at: legal@kruthika.fun
                
                For immediate support or safety concerns, please contact: support@kruthika.fun
              </p>
            </section>
            <div className="pt-4 flex justify-center">
                 <Link href="/" legacyBehavior>
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
