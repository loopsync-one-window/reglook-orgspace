"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Check, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";

interface UserProfile {
  employee_id: string;
  full_name: string;
  job_title: string;
  department: string;
  location: string;
  profile_image_url: string;
  date_of_birth: string;
  username: string;
}

interface MyProfileProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function MyProfile({ isCollapsed = false, onToggleCollapse }: MyProfileProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl + Shift + N
      if (event.ctrlKey && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        onToggleCollapse?.();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggleCollapse]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log("Fetching user profile...");

        // Check localStorage for tokens
        let accessToken = localStorage.getItem('accessToken');

        // If not found, check for alternative names
        if (!accessToken) {
          const keys = Object.keys(localStorage);
          for (let key of keys) {
            if (key.toLowerCase().includes('access') && key.toLowerCase().includes('token')) {
              accessToken = localStorage.getItem(key);
              console.log(`Found access token with alternative key: ${key}`);
              break;
            }
          }
        }

        console.log("Access token:", accessToken);

        if (!accessToken) {
          setError("No access token found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch('https://orgspace.reglook.com/api/v1/intranet/employees/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("User data:", data);

          setUserProfile({
            employee_id: data.employee.employee_id,
            full_name: data.employee.full_name,
            job_title: data.employee.job_title,
            department: data.employee.department,
            location: data.employee.location,
            profile_image_url: data.employee.profile_image_url,
            date_of_birth: data.employee.onboarding_data?.date_of_birth || '',
            username: data.employee.onboarding_data?.username || data.employee.username || '',
          });
        } else {
          const errorText = await response.text();
          console.log("Error response:", errorText);
          setError(`Failed to fetch profile: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(`Error fetching profile: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className={`${isCollapsed ? 'w-12' : 'w-[320px]'} bg-[#0a0a0a] border-l border-[#1f1f1f] flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <div className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
          {!isCollapsed && (
            <h3 className="text-sm font-semibold text-gray-300">My Profile</h3>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-center">
            <div className="iphone-spinner scale-75" style={{ color: '#fff' }} aria-label="Loading" role="status">
              <div></div><div></div><div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    // console.error("Profile error:", error);
    return (
      <div className={`${isCollapsed ? 'w-12' : 'w-[320px]'} bg-[#0a0a0a] border-l border-[#1f1f1f] flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <div className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
          {!isCollapsed && (
            <h3 className="text-sm font-semibold text-gray-300">My Profile</h3>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-red-500">
              <p className="text-sm">Error loading profile</p>
              {/* <p className="text-xs mt-2">{error}</p> */}
              <Button
                className="mt-4 text-xs"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-[320px]'} bg-[#0a0a0a] border-l border-[#1f1f1f] flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'px-2' : 'px-6'}`}>
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="w-8 h-8 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
        >
          {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-gray-300">My Profile</h3>
        )}
      </div>

      {!isCollapsed && userProfile && (
        <ScrollArea className="flex-1 p-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <Avatar className="w-40 h-40 border-2 border-[#2a2a2a]">
                <AvatarImage src={userProfile.profile_image_url || "/profile/default.png"} />
                <AvatarFallback className="bg-[#2a2a2a] text-lg">
                  {userProfile.full_name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-base font-bold text-gray-200 mb-1 flex items-center gap-2">
              {userProfile.full_name}
            </h2>
            <span className="textbase text-white/40 font-normal">@{userProfile.username}</span>

            <p className="text-base text-gray-500 mb-3">{userProfile.job_title || "Job Title Not Set"}</p>

            <div className="flex gap-3 mt-4">
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium bg-transparent hover:bg-transparent border-white/20 hover:border-white/50 hover:text-white rounded-full opacity-50 pointer-events-none"
                  disabled
                >
                  Edit Profile
                </Button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-white text-black text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  Inactive
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
                </div>
              </div>
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium bg-transparent hover:bg-transparent border-white/20 hover:border-white/50 hover:text-white rounded-full opacity-50 pointer-events-none"
                  disabled
                >
                  HQ Certificate
                </Button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-white text-black text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  Inactive
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
                </div>
              </div>
            </div>

            <div className="w-full mt-20 space-y-3 text-sm bg-black p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="font-medium">ID:</span>
                <span>{userProfile.employee_id || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span>{userProfile.department || "Department Not Set"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{userProfile.location || "Location Not Set"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString() : 'Date of Birth Not Set'}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}

      {/* Show a message when not collapsed but no profile data */}
      {!isCollapsed && !userProfile && !loading && !error && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-500">
            <p className="text-sm">No profile data available</p>
          </div>
        </div>
      )}

      {/* Keyboard shortcut indicator at bottom */}
      {!isCollapsed && (
        <div className="px-4 pb-3">
          <span className="text-xs text-gray-500 font-mono">Ctrl + Shift + N</span>
        </div>
      )}
    </div>
  );
}