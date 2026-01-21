"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Disable scrolling and interaction when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  const handleUnderstand = () => {
    setIsClosing(true);
    // Add a small delay to show the spinner before closing
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background blur overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal content */}
      <div className="relative bg-transparent rounded-lg shadow-2xl max-w-lg w-full mx-4 p-6 animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logos/logo1.svg"
            alt="Company Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Disclaimer text */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Privacy Notice
          </h2>

          <p className="text-gray-300 sm:text-sm text-xs leading-relaxed">
            Direct messages are end-to-end encrypted, ensuring complete privacy.
            Team chats, however, are regularly monitored by authorized headquarters personnel to maintain security, compliance, and workplace integrity.
          </p>
        </div>

        {/* Close button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleUnderstand}
            disabled={isClosing}
            className="px-6 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-[#1a1a1a]"
          >
            {isClosing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="iphone-spinner scale-75" style={{ color: '#fff' }} aria-label="Loading" role="status">
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                </span>
              </span>
            ) : (
              "I Understand"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
