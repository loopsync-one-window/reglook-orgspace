"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const headerNavItems = [
  {
    title: "Home",
    href: "/hangar",
  },
  {
    title: "Attendance",
    href: "/hangar/attendance",
  },
  {
    title: "Directory",
    href: "/hangar/directory",
  },
  {
    title: "Announcements",
    href: "/hangar/announcements",
  },
  {
    title: "Academy",
    href: "/hangar/learning",
  },
  {
    title: "Resources",
    href: "/hangar/resources",
  },
  {
    title: "Helpdesk",
    href: "/hangar/helpdesk",
  },
  {
    title: "Org Space",
    href: "/chat",
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 20 * 60; // Reset to 20 minutes when it reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNavigateToChat = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/chat');
    }, 800); // Small delay to show the spinner
  };

  return (
    <>
      {/* Timer positioned above everything - matching original position */}
      <div className="fixed top-16 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center">
            <div className="flex items-center space-x-2 mr-4 ml-20">
              <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-mono font-semibold">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <header className="fixed top-16 z-40 w-full bg-white border-b border-gray-200 pb-1">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center">
            {/* Empty space for timer - maintains layout */}
            <div className="flex items-center space-x-2 mr-4 invisible">
              <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-mono font-semibold">
                00:00
              </div>
            </div>
            
            <nav className="flex items-center justify-between w-full pointer-events-none">
              {headerNavItems.map((item) => (
                <div key={item.title} className="flex-1 text-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-block text-sm font-semibold transition-all duration-300 text-gray-600 hover:text-black group",
                      pathname === item.href && "text-black"
                    )}
                  >
                    {item.title}
                    
                    {/* Animated underline - only text width */}
                    <span className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100",
                      pathname === item.href ? "w-full opacity-100" : "w-0 opacity-0"
                    )} />
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Blur overlay layer on top of header */}
      <div className="fixed top-16 left-0 right-0 h-14 bg-white/30 backdrop-blur-sm z-45">
        {/* Centered content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <p className="text-[16px] font-bold text-gray-800">
              Back to Intellaris Org Space
            </p>
            <button 
              onClick={handleNavigateToChat}
              disabled={isNavigating}
              className="px-4 py-1 border border-black rounded-full text-[16px] font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isNavigating ? (
                <span className="flex items-center gap-2">
                  <span className="iphone-spinner scale-75" style={{ color: 'currentColor' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                </span>
              ) : (
                "Go Back"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
