"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wifi, WifiOff, Globe, ShieldCheck, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [online, setOnline] = useState<boolean>(true);
  const [downlinkMbps, setDownlinkMbps] = useState<number | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);
  const [secureStatus, setSecureStatus] = useState<"secure" | "hardened" | "insecure">("insecure");
  const [secureNote, setSecureNote] = useState<string>("");
  const [setupLoading, setSetupLoading] = useState<boolean>(false);
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const navAny = navigator as any;
    const connection = navAny?.connection || navAny?.mozConnection || navAny?.webkitConnection;
    const setConnectionInfo = () => {
      if (connection?.downlink) setDownlinkMbps(Number(connection.downlink));
    };
    if (connection) {
      setConnectionInfo();
      connection.addEventListener?.("change", setConnectionInfo);
    }

    // Evaluate security
    const evalSecurity = () => {
      const https = typeof window !== "undefined" ? window.location.protocol === "https:" : false;
      const secureCtx = typeof window !== "undefined" ? window.isSecureContext : false;
      const cspMeta = typeof document !== "undefined" ? document.querySelector('meta[http-equiv="Content-Security-Policy"]') : null;
      const swControlled = typeof navigator !== "undefined" ? Boolean((navigator as any).serviceWorker?.controller) : false;
      if (https && secureCtx && (cspMeta || swControlled)) {
        setSecureStatus("hardened");
        setSecureNote(swControlled ? "SW active" : "CSP active");
      } else if (https && secureCtx) {
        setSecureStatus("secure");
        setSecureNote("HTTPS");
      } else {
        setSecureStatus("insecure");
        setSecureNote("Not HTTPS");
      }
    };
    evalSecurity();

    // Fetch public IP address and provider periodically
    let ipInterval: any = null;
    const fetchIp = async () => {
      try {
        const res = await fetch("/api/ip", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.ip) setIpAddress(String(data.ip));
          if (data?.org) setProviderName(String(data.org));
        }
      } catch {
        // silently ignore
      }
    };
    fetchIp();
    ipInterval = setInterval(() => {
      fetchIp();
      evalSecurity();
    }, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) connection.removeEventListener?.("change", setConnectionInfo);
      if (ipInterval) clearInterval(ipInterval);
    };
  }, []);

  // Prevent copying/selection/drag and common shortcut copies across the page
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const preventKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "x" || e.key === "a" || e.key === "s")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("copy", preventDefault, true);
    document.addEventListener("cut", preventDefault, true);
    document.addEventListener("contextmenu", preventDefault, true);
    document.addEventListener("selectstart", preventDefault, true);
    document.addEventListener("dragstart", preventDefault, true);
    document.addEventListener("keydown", preventKey, true);

    return () => {
      document.removeEventListener("copy", preventDefault, true);
      document.removeEventListener("cut", preventDefault, true);
      document.removeEventListener("contextmenu", preventDefault, true);
      document.removeEventListener("selectstart", preventDefault, true);
      document.removeEventListener("dragstart", preventDefault, true);
      document.removeEventListener("keydown", preventKey, true);
    };
  }, []);

  const displayProvider = useMemo(() => {
    if (!providerName) return null;
    let name = providerName;
    // Strip ASN prefix like "AS55836 "
    name = name.replace(/^AS\d+\s+/i, "");
    // Remove common corporate suffixes and telecom descriptors
    name = name.replace(/\b(Private|Pvt\.?|Limited|Ltd\.?|Incorporated|Inc\.?|LLP|LLC|Company|Co\.?|Communications?|Telecom|Telecommunications?|Networks?|Infocomm?|Holdings?)\b/gi, "");
    // Collapse multiple spaces
    name = name.replace(/\s{2,}/g, " ").trim();
    // Special cases for popular Indian ISPs
    if (/reliance\s*jio/i.test(name)) return "Jio";
    if (/airtel/i.test(name)) return "Airtel";
    if (/vi\b|vodafone|idea/i.test(name)) return "Vi";
    if (/bsnl/i.test(name)) return "BSNL";
    return name;
  }, [providerName]);

  const handleNavigateSSO = () => {
    const el = rootRef.current;
    if (!el) {
      router.push("/sso");
      return;
    }
    el.classList.add("page-fade-out");
    setTimeout(() => {
      router.push("/sso");
    }, 220);
  };
  const handleSetupClick = () => {
    if (setupLoading) return;
    setSetupLoading(true);
    setTimeout(() => {
      setSetupLoading(false);
      router.push("/setup");
    }, 2500);
  };
  return (
    <div
      ref={rootRef}
      className="min-h-screen relative bg-[url('/images/bg-image.png')] bg-cover bg-center bg-no-repeat text-white overflow-hidden select-none page-fade-in"
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      draggable={false}
    >
      {/* Subtle overlay to match reference depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content aligned to match reference */}
      <main className="relative z-10 min-h-screen px-6 sm:px-10">
        {/* Top-left logo */}
        <div className="absolute left-6 sm:left-14 top-6 sm:top-16">
          <img
            src="/logos/logo1.svg"
            alt="Intellaris logo"
            className="h-8 sm:h-10 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            draggable={false}
          />
        </div>
        {/* Top-right logo */}
        <div className="absolute right-6 sm:right-14 top-6 sm:top-16">
          <img
            src="/logos/reglook-logo.svg"
            alt="Reglook Logo"
            className="h-7 sm:h-7 w-auto object-contain"
          />
        </div>

        {/* Centered title block */}
        <div className="absolute inset-0 pb-20 sm:pb-0 flex items-center justify-center">
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="shimmer-text font-semibold tracking-tight leading-none text-[52px] sm:text-[72px] md:text-[94px]">INTELLARIS</h1>
            <p className="text-white/90 font-light tracking-tight leading-none text-[28px] sm:text-[40px] md:text-[40px]">INTRANET ECOSYSTEM</p>
            <div className="mt-4 sm:mt-10 flex items-center  justify-center gap-3 sm:gap-4">
              <Button onClick={handleSetupClick} disabled={setupLoading} size="lg" variant="secondary" className="px-6 rounded-full cursor-pointer sm:px-8 font-semibold">
                {setupLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="iphone-spinner scale-75" style={{ color: '#ffffffff' }} aria-label="Loading" role="status">
                      <div></div><div></div><div></div><div></div><div></div><div></div>
                      <div></div><div></div><div></div><div></div><div></div><div></div>
                    </span>
                    <span>Setting up…</span>
                  </span>
                ) : (
                  <span>Setup</span>
                )}
              </Button>
              <Button onClick={handleNavigateSSO} size="lg" className="px-6 sm:px-8 rounded-full cursor-pointer font-semibold">
                Sign-On (SSO)
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Responsive Container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col-reverse md:flex-row items-center md:items-end justify-between gap-6 z-20">
          {/* Left: Wordmark */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md border border-white/60 grid place-items-center">
              <ArrowRight className="h-4 w-4 text-white/85" strokeWidth={2} />
            </div>
            <span className="tracking-widest text-xl sm:text-2xl font-medium">REGLOOK.COM</span>
          </div>

          {/* Right: Nav and Status */}
          <div className="flex flex-col items-center md:items-end gap-3 text-white/90">
            <nav className="flex items-center gap-4 text-sm">
              <a className="hover:text-white transition-colors cursor-pointer text-center md:text-right">Intellaris Private Limited</a>
            </nav>
            <div className="hidden md:block h-px w-full bg-white/30 my-1" />
            <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-xs">
              <div className="flex items-center gap-1.5" title={online ? (displayProvider ?? providerName ?? (downlinkMbps ? `${downlinkMbps} Mbps` : "Online")) : "Offline"}>
                {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span className="whitespace-nowrap">{online ? (displayProvider ?? (downlinkMbps ? `${downlinkMbps} Mbps` : "Online")) : "Offline"}</span>
              </div>
              <div className="flex items-center gap-1.5" title={secureStatus === "insecure" ? "Not served over HTTPS or insecure context" : secureStatus === "hardened" ? `Hardened • ${secureNote}` : `Secure • ${secureNote}`}>
                {secureStatus === "insecure" ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                <span className="whitespace-nowrap">
                  {secureStatus === "insecure" ? "Insecure" : secureStatus === "hardened" ? "Hardened" : "Secure"}
                </span>
              </div>
              <div className="flex items-center gap-1.5" title={ipAddress ? `Public IP: ${ipAddress}` : "Fetching public IP"}>
                <Globe className="h-4 w-4" />
                <span className="whitespace-nowrap">{ipAddress ?? "Fetching…"}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
