"use client";

import React from "react";
import Image from "next/image";
import { Users, Zap, Shield, ChevronRight } from "lucide-react";

export default function NoChatSelected() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-full bg-black text-white p-6 relative">
      {/* QR Code Overlay - Top Right */}
      {/* <div className="absolute top-6 right-6 flex flex-col items-center space-y-2">
        <div className="w-20 h-20 flex items-center justify-center">
          <Image
            src="/qr/qr-code.svg"
            alt="Mobile App QR Code"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <p className="text-xs text-gray-400 text-center font-medium">
          Get the<br/>Mobile App
        </p>
      </div> */}

      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo/Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#000000] to-[#000000] flex items-center justify-center shadow-2xl shadow-[#ffffff]/30">
            <Image
              src="/logos/logo1.svg"
              alt="Intellaris Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-5xl font-medium text-gray-100 font-[family-name:var(--font-poppins)]" style={{ letterSpacing: '-0.01em', lineHeight: '1.1' }}>
            <span className="bg-gradient-to-r from-[#ffffff]/60 via-[#ffffff] to-[#ffffff]/60 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="text-white text-3xl md:text-5xl font-medium">
              Intellaris Org Space
            </span>
          </h2>
          <p className="text-gray-400 leading-relaxed mt-10">
            A secure internal communication platform designed for efficient and confidential collaboration<br />across Intellaris. Select a conversation from the sidebar to engage with your team.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 mt-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">Team Collaboration</p>
              <p className="text-xs text-gray-500">Connect with your team</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">Real-time Messaging</p>
              <p className="text-xs text-gray-500">Instant communication</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">Secure & Private</p>
              <p className="text-xs text-gray-500">End-to-end encrypted</p>
            </div>
          </div>
        </div>

        {/* Hint - Removed the switch button as it's now in the sidebar */}
      </div>
    </div>
  );
}
