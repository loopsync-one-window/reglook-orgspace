"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ShieldAlert, ShieldCheck, Wifi, WifiOff, ArrowRight, ArrowBigDown, Touchpad, ExternalLink } from "lucide-react";

export default function SSOPage() {
	const [online, setOnline] = useState<boolean>(true);
	const [downlinkMbps, setDownlinkMbps] = useState<number | null>(null);
	const [ipAddress, setIpAddress] = useState<string | null>(null);
	const [providerName, setProviderName] = useState<string | null>(null);
	const [secureStatus, setSecureStatus] = useState<"secure" | "hardened" | "insecure">("insecure");
	const [secureNote, setSecureNote] = useState<string>("");
	const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

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

		// Try to play video when component mounts
		const playVideo = () => {
			if (videoRef.current) {
				videoRef.current.play().catch(e => {
					console.log("Autoplay failed:", e);
				});
			}
		};

		// Play video after a short delay to ensure it loads
		const videoPlayTimeout = setTimeout(playVideo, 500);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			if (connection) connection.removeEventListener?.("change", setConnectionInfo);
			if (ipInterval) clearInterval(ipInterval);
			if (videoPlayTimeout) clearTimeout(videoPlayTimeout);
		};
	}, []);

	// Prevent copying/selection/drag and common shortcut copies across the page (match main page)
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
		name = name.replace(/^AS\d+\s+/i, "");
		name = name.replace(/\b(Private|Pvt\.?|Limited|Ltd\.?|Incorporated|Inc\.?|LLP|LLC|Company|Co\.?|Communications?|Telecom|Telecommunications?|Networks?|Infocomm?|Holdings?)\b/gi, "");
		name = name.replace(/\s{2,}/g, " ").trim();
		if (/reliance\s*jio/i.test(name)) return "Jio";
		if (/airtel/i.test(name)) return "Airtel";
		if (/vi\b|vodafone|idea/i.test(name)) return "Vi";
		if (/bsnl/i.test(name)) return "BSNL";
		return name;
	}, [providerName]);

	const onConfirm = async (e: React.FormEvent) => {
		e.preventDefault();
		if (confirmLoading) return;

		// Basic validation
		if (!username.trim() || !password.trim()) {
			setError("Please enter both username and password");
			return;
		}

		setConfirmLoading(true);
		setError(null);

		try {
			const response = await fetch("https://orgspace.reglook.com/api/v1/intranet/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username.trim(),
					password: password.trim()
				})
			});

			const data = await response.json();

			if (data.success) {
				// Store tokens in localStorage
				if (data.data?.accessToken) {
					localStorage.setItem('accessToken', data.data.accessToken);
				}
				if (data.data?.refreshToken) {
					localStorage.setItem('refreshToken', data.data.refreshToken);
				}

				// Store user data in localStorage
				if (data.data?.employee) {
					localStorage.setItem('user_data', JSON.stringify(data.data.employee));
				}

				// Login successful - redirect to chat page
				window.location.href = "/chat";
			} else {
				// Login failed - show error message
				setError(data.message || "Invalid username or password");
			}
		} catch (err) {
			console.error("Login error:", err);
			setError("Failed to connect to the server. Please try again.");
		} finally {
			setConfirmLoading(false);
		}
	};

	return (
		<div
			className="relative min-h-screen grid place-items-center px-4 pb-10 pt-10 sm:py-10 text-white page-fade-in select-none overflow-hidden"
			onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
			draggable={false}
		>
			{/* Initial Setup button */}
			<button
				onClick={() => window.location.href = '/setup'}
				className="absolute top-6 right-6 text-sm text-white font-semibold cursor-pointer bg-transparent border-none hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-colors duration-300 p-2"
			>
				Setup <ExternalLink className="inline-block h-4 text-white " />
			</button>

			{/* Background Video */}
			<video
				ref={videoRef}
				autoPlay
				muted
				loop
				playsInline
				className="absolute inset-0 w-full h-full object-cover z-[-1]"
				src="/videos/sso-bg.mp4"
				onError={(e) => {
					console.error("Video failed to load:", e);
				}}
			/>

			{/* Video overlay for better text readability */}
			<div className="absolute inset-0 bg-black/85 z-[-1]"></div>

			<div className="w-full max-w-md">
				<div className="mb-8 grid place-items-center gap-3 text-center">
					<Image src="/logos/logo1.svg" alt="Intellaris" width={64} height={64} priority />
					<h1 className="text-2xl font-bold mt-10">Sign-On (SSO)</h1>
					<p className="text-sm font-semibold text-zinc-400">Enter your username and password to continue</p>
				</div>

				<form onSubmit={onConfirm} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							name="username"
							placeholder=""
							className="h-11 rounded-full font-semibold border-white/10 focus-visible:border-white/30 bg-black/30 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-white/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
							style={{
								boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
							}}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							className="h-11 rounded-full border-white/10 focus-visible:border-white/30 bg-black/30 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-white/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
							style={{
								boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
							}}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					{error && (
						<div className="text-red-400 text-sm text-center">{error}</div>
					)}
					<Button type="submit" disabled={confirmLoading} className="h-11 rounded-xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
						style={{
							boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
						}}>
						{confirmLoading ? (
							<span className="flex items-center justify-center gap-2">
								<span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
									<div></div><div></div><div></div><div></div><div></div><div></div>
									<div></div><div></div><div></div><div></div><div></div><div></div>
								</span>
								<span>Confirming…</span>
							</span>
						) : (
							<span>Confirm</span>
						)}
					</Button>
				</form>

				<p className="mt-6 text-center text-xs text-zinc-500">By continuing, you agree to our <button onClick={() => window.location.href = '/privacy'} className="underline underline-offset-4 text-zinc-300 cursor-pointer hover:text-white">Corporate Policy</button> and <button onClick={() => window.location.href = '/terms'} className="underline underline-offset-4 text-zinc-300 cursor-pointer hover:text-white">T&Cs</button></p>
			</div>


		</div>
	);
}