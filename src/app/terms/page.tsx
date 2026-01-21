"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with back button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={handleGoBack}
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Terms & Conditions</h1>
            <div></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 pt-[100px]">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Intranet Terms and Conditions</h1>
          
          <p className="text-gray-300 mb-6">
            These Terms and Conditions govern your use of the Intellaris Private Limited intranet system. 
            By accessing or using our intranet, you agree to comply with these terms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-4">
                By accessing and using the Intellaris Intranet, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and Conditions, as well as any 
                additional guidelines, policies, or procedures that may be posted from time to time.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Access and Use</h2>
              <p className="text-gray-300 mb-4">
                Access to the intranet is provided to authorized employees, contractors, and partners 
                of Intellaris Private Limited. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Use the system only for legitimate business purposes</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Not share your account with others</li>
                <li>Comply with all company policies and procedures</li>
                <li>Report any security incidents or vulnerabilities immediately</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Prohibited Activities</h2>
              <p className="text-gray-300 mb-4">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Unauthorized access to systems or data</li>
                <li>Distribution of malicious software or code</li>
                <li>Harassment or discrimination of other users</li>
                <li>Violation of intellectual property rights</li>
                <li>Transmission of confidential information outside the organization</li>
                <li>Use of the system for personal gain or illegal activities</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Content Ownership</h2>
              <p className="text-gray-300 mb-6">
                All content available on the intranet, including documents, images, and other materials, 
                remains the property of Intellaris Private Limited or its licensors. You may access and 
                use this content only for authorized business purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. User-Generated Content</h2>
              <p className="text-gray-300 mb-4">
                Any content you upload, post, or share on the intranet:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Must not violate any laws or third-party rights</li>
                <li>Must be appropriate for a professional workplace</li>
                <li>Remains your responsibility for accuracy and legality</li>
                <li>Grants Intellaris Private Limited a non-exclusive license to use for business purposes</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. System Monitoring</h2>
              <p className="text-gray-300 mb-6">
                Intellaris Private Limited reserves the right to monitor, review, and audit all activities 
                on the intranet system to ensure compliance with these terms, company policies, and 
                applicable laws. This includes reviewing content, access logs, and usage patterns.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination of Access</h2>
              <p className="text-gray-300 mb-6">
                Intellaris Private Limited may suspend or terminate your access to the intranet at any time, 
                with or without cause, and with or without notice, if we believe you have violated these 
                Terms and Conditions or engaged in inappropriate conduct.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-300 mb-6">
                The intranet is provided "as is" without warranties of any kind, either express or implied. 
                Intellaris Private Limited does not warrant that the system will be uninterrupted or error-free, 
                or that defects will be corrected.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 mb-6">
                To the maximum extent permitted by law, Intellaris Private Limited shall not be liable for 
                any indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
                or revenues, whether incurred directly or indirectly.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-300 mb-6">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be 
                effective immediately upon posting to the intranet. Your continued use of the system 
                constitutes acceptance of the revised terms.
              </p>

              <div className="border-t border-gray-800 pt-6 mt-8">
                <p className="text-gray-400 text-sm">
                  Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}