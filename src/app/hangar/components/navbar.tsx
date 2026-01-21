"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  Home,
  Users,
  Settings,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  Plane,
  Wrench,
  FileText,
  BarChart3,
  Shield,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "CoreLabs",
    href: "/hangar/corelabs",
  },
  {
    title: "Atlas",
    href: "/hangar/atlas",
  },
  {
    title: "Vault",
    href: "/hangar/vault",
  },
  {
    title: "Crew",
    href: "/hangar/crew",
  },
  {
    title: "Mission",
    href: "/hangar/mission",
  },
  {
    title: "HR",
    href: "/hangar/hr",
  },
  {
    title: "OpsCenter",
    href: "/hangar/opscenter",
  },
  {
    title: "Payroll",
    href: "/hangar/payroll",
  },
];

const userMenuItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/setup/help",
    icon: HelpCircle,
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-black backdrop-blur supports-[backdrop-filter]:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/hangar" className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center">
                <Image
                  src="/logos/logo1.svg"
                  alt="Company Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">+</span>
                <div className="h-8 w-8 rounded-md border border-white/60 grid place-items-center">
                  <ArrowRight className="h-4 w-4 text-white/85" strokeWidth={2} />
                </div>
                <span className="tracking-widest text-xl font-medium text-white">REGLOOK.COM</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white group",
                    pathname === item.href && "text-white"
                  )}
                >
                  {item.title}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full",
                    pathname === item.href ? "w-full" : "w-0"
                  )} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden rounded-full sm:flex text-gray-300 hover:bg-white hover:text-black">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative rounded-full text-gray-300 hover:bg-white hover:text-black">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white hover:text-black">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback className="bg-white text-black">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@company.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black border-gray-800">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-800">
                    <div className="flex h-8 w-8 items-center justify-center">
                      <Image
                        src="/logos/logo1.svg"
                        alt="Company Logo"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-white">+</span>
                      <div className="h-8 w-8 rounded-md border border-white/60 grid place-items-center">
                        <ArrowRight className="h-4 w-4 text-white/85" strokeWidth={2} />
                      </div>
                      <span className="tracking-widest text-xl font-medium text-white">REGLOOK.COM</span>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-3">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "relative text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white group py-2",
                          pathname === item.href && "text-white"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.title}
                        <span className={cn(
                          "absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full",
                          pathname === item.href ? "w-full" : "w-0"
                        )} />
                      </Link>
                    ))}
                  </nav>

                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="User" />
                        <AvatarFallback className="bg-gray-700 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-white">John Doe</p>
                        <p className="text-xs text-gray-400 truncate">
                          john.doe@company.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
