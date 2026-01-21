"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Mail, MessageCircle, MapPin, Building } from "lucide-react";

interface Employee {
  id: string;
  full_name: string;
  job_title: string;
  department: string;
  work_email: string;
  location?: string;
  profile_image_url?: string;
}

// Add currentUserID to props
export default function OrganisationDirectory({ onDirectMessage }: { onDirectMessage: (userId: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUserID, setCurrentUserID] = useState<string | null>(null); // Add state for current user ID
  const [executiveStatus, setExecutiveStatus] = useState<Record<string, boolean>>({}); // Track executive status for each employee

  // Fetch auth token and current user ID
  useEffect(() => {
    // Try to get token from localStorage
    let accessToken = null;
    let userId = null;

    // First try the standard key
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('access_token');

      // If not found, try alternative keys
      if (!accessToken) {
        const keys = Object.keys(localStorage);
        for (let key of keys) {
          if (key.toLowerCase().includes('access') && key.toLowerCase().includes('token')) {
            accessToken = localStorage.getItem(key);
            break;
          }
        }
      }

      // Try to get user ID from localStorage
      const possibleKeys = ['employee_id', 'user_id', 'current_user_id'];
      for (const key of possibleKeys) {
        userId = localStorage.getItem(key);
        if (userId) {
          console.log("Found user ID in localStorage key:", key, "value:", userId);
          break;
        }
      }
    }

    if (accessToken) {
      setAuthToken(accessToken);

      // If still not found, try to parse from token
      if (!userId && accessToken) {
        try {
          // Decode JWT token to get user ID
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            userId = payload.id || payload.employee_id || payload.user_id;
            console.log("Found user ID in token payload:", userId);
          }
        } catch (e) {
          console.log("Failed to decode token:", e);
        }
      }
    }

    if (userId) {
      setCurrentUserID(userId);
    }
  }, []);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the public API endpoint that doesn't require authentication
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/hq/employees/public`);

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        // Extract employees array from the response
        const fetchedEmployees = data.data.employees || [];
        setEmployees(fetchedEmployees);

        // Fetch executive status for all employees
        await fetchExecutiveStatusForEmployees(fetchedEmployees);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch executive status for all employees
  const fetchExecutiveStatusForEmployees = async (employees: Employee[]) => {
    try {
      const statusMap: Record<string, boolean> = {};

      // Fetch executive status for each employee
      for (const employee of employees) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/hq/executive/status/${employee.id}`);
          if (response.ok) {
            const data = await response.json();
            statusMap[employee.id] = data.data.isExecutive;
          } else {
            statusMap[employee.id] = false;
          }
        } catch (error) {
          console.error(`Error fetching executive status for ${employee.id}:`, error);
          statusMap[employee.id] = false;
        }
      }

      setExecutiveStatus(statusMap);
    } catch (error) {
      console.error('Error fetching executive statuses:', error);
    }
  };

  // Function to handle direct messaging
  const handleDirectMessage = async (memberId: string, memberName: string) => {
    console.log(`Direct message to ${memberName} (ID: ${memberId})`);

    // Prevent messaging self
    if (currentUserID && memberId === currentUserID) {
      console.log("Cannot message yourself");
      return;
    }

    // Pass the user ID to open a chat with that user
    // The chat system will load any existing conversation or create a new one
    onDirectMessage(memberId);
  };

  // Filter members based on search query and sort to put current user first
  const filteredMembers = employees
    .filter(member =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.work_email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Put current user first
      if (currentUserID) {
        if (a.id === currentUserID) return -1;
        if (b.id === currentUserID) return 1;
      }
      return 0;
    });

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="iphone-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  // Show error message if fetching failed
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 mb-4">Error loading employees: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Header */}
      <div className="p-4 md:p-5 bg-black border-b border-[#1f1f1f] flex items-center justify-between px-6"
        style={{
          boxShadow: "0 4px 12px rgba(255, 255, 255, 0.05)"
        }}>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white" style={{
            textShadow: "0 0 8px rgba(255, 255, 255, 0.3)"
          }}>Organisation Directory</h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search members by name, title, department."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#0a0a0a] border-[#fff]/5 text-white font-semibold placeholder:text-gray-500 h-12 rounded-full focus-visible:ring-0 focus-visible:ring-[#fff]/5"
          />
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const isCurrentUser = currentUserID && member.id === currentUserID;
              const isExecutive = executiveStatus[member.id] || false;
              return (
                <div
                  key={member.id}
                  className="flex flex-col items-center p-6 rounded-xl bg-[#0a0a0a] transition-colors hover:bg-none"
                >
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={member.profile_image_url || "/profile/default.png"} alt={member.full_name} />
                    <AvatarFallback className="bg-[#1a1a1a] text-gray-300 text-2xl">
                      {member.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{member.full_name}</h3>
                      {isExecutive && (
                        <span className="inline-flex items-center justify-center w-5 h-5">
                          <img
                            src="/special/executive.svg"
                            alt="Executive"
                            className="w-4 h-4"
                          />
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mt-1">{member.job_title}</p>
                    <div className="flex items-center justify-center gap-2 mt-1 text-sm text-gray-500">
                      <span>{member.department}</span>
                      <div className="w-px h-4 bg-gray-600"></div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{member.location || 'Location not specified'}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <div
                        className={`flex items-center gap-2 ${isCurrentUser
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-white/50 hover:text-white cursor-pointer scale-90 transition-transform hover:scale-100"
                          }`}
                        onClick={() => !isCurrentUser && handleDirectMessage(member.id, member.full_name)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isCurrentUser ? "This is you" : "Direct Message"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center text-center justify-center w-200 h-100 py-12">
              <div className="text-center mx-auto">
                <Building className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No employees found</h3>
                <p className="text-white/50">Try adjusting your search to find what you're looking for.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}