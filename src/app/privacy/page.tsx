"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <div></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 pt-[100px]">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Intranet Privacy Policy</h1>
          
          <p className="text-gray-300 mb-6">
            This Privacy Policy describes how Intellaris Private Limited ("we", "our", or "the Company") 
            collects, uses, and protects the personal information of employees, contractors, and other 
            authorized users of our internal intranet system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                We collect information that you provide directly to us when using the intranet, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Profile information (name, job title, department, contact details)</li>
                <li>Login credentials and authentication data</li>
                <li>Usage data and analytics about intranet interactions</li>
                <li>Content you create, share, or upload to the system</li>
                <li>Communication data from internal messaging systems</li>
                <li>Feedback and survey responses</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>To provide and maintain the intranet services</li>
                <li>To personalize your experience and content delivery</li>
                <li>To facilitate internal communication and collaboration</li>
                <li>To improve our systems and user experience</li>
                <li>To ensure security and compliance with company policies</li>
                <li>To conduct internal analytics and reporting</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Protection</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal data, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Encrypted data transmission and storage</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
                <li>Incident response procedures</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention</h2>
              <p className="text-gray-300 mb-6">
                We retain your personal information for as long as necessary to fulfill the purposes outlined 
                in this policy, unless a longer retention period is required by law.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
              <p className="text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Access your personal information held by us</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data when no longer necessary</li>
                <li>Object to processing in certain circumstances</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Information</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact 
                our Data Protection Officer at privacy@Intellaris.com or through the internal helpdesk system.
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