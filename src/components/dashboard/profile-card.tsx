"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Star, Users, CheckCircle, Trophy, UserCircle } from "lucide-react";
import { useState } from "react";

export default function ProfileCard() {
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 1000); // Animation duration: 1 second
  };

  return (
    <div className="relative p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Profile</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          onClick={handleRefresh}
        >
          <RefreshCw 
            className={`h-4 w-4 text-gray-400 transition-transform duration-1000 ${
              isRotating ? 'rotate-[360deg]' : ''
            }`}
          />
        </Button>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center mb-4 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 p-0.5 relative shadow-lg shadow-blue-500/30">
            <Avatar className="w-full h-full">
              <AvatarImage src="/profile/ripun.jpg" alt="Ripun Basumatary" className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-300 to-blue-300 text-white font-semibold text-lg">
                RB
              </AvatarFallback>
            </Avatar>
            {/* Star badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <Star className="h-3 w-3 text-white fill-current drop-shadow-sm" />
            </div>
            {/* Glossy highlight */}
            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white/40 blur-sm"></div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mb-6 relative z-10">
        <h4 className="text-xl font-bold text-black mb-1">Ripun Basumatary</h4>
        <p className="text-sm text-gray-600">Software Engineer</p>
      </div>

      {/* Metrics Badges */}
      <div className="flex justify-center space-x-2 relative z-10">
        <div className="bg-blue-100 rounded-lg px-3 py-2 flex items-center space-x-1 border border-blue-200/50 relative overflow-hidden shadow-md shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
          <Users className="h-4 w-4 text-blue-600 relative z-10" />
          <span className="text-sm font-semibold text-blue-800 relative z-10">11</span>
        </div>
        <div className="bg-green-100 rounded-lg px-3 py-2 flex items-center space-x-1 border border-green-200/50 relative overflow-hidden shadow-md shadow-green-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
          <CheckCircle className="h-4 w-4 text-green-600 relative z-10" />
          <span className="text-sm font-semibold text-green-800 relative z-10">56</span>
        </div>
        <div className="bg-yellow-100 rounded-lg px-3 py-2 flex items-center space-x-1 border border-yellow-200/50 relative overflow-hidden shadow-md shadow-yellow-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
          <Trophy className="h-4 w-4 text-yellow-600 relative z-10" />
          <span className="text-sm font-semibold text-yellow-800 relative z-10">12</span>
        </div>
      </div>
    </div>
  );
}
