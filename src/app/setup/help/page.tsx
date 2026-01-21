"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function HelpSetupPage() {
	const sections: Array<{ id: string; title: string; desc: string }> = [
		{ id: "verify", title: "Verify your phone (OTP)", desc: "Verify your 10-digit phone number. If you don't have an OTP yet, use Send Code; once received, enter the 6-character OTP to proceed." },
		{ id: "profile", title: "Step 1 • Personal Profile", desc: "Provide name, job title, department, reporting manager, work email, address, secondary mobile, and location preference (Office/Remote/Hybrid)." },
		{ id: "hr", title: "Step 2 • Banking, IDs, and Background", desc: "Add PAN, Aadhar, other tax IDs if any; payroll bank details; previous employment summary; upload last 3 salary slips as required by HR." },
		{ id: "policies", title: "Step 3 • Policy Acknowledgements", desc: "Accept Code of Conduct, Leave, IT Usage, Confidentiality, Location, and Data Privacy. You must review and accept all to continue." },
		{ id: "work", title: "Step 4 • Work Preferences", desc: "Choose your joining date, preferred work hours, confirm your time zone, and select notification channels (Email, Intranet, Mobile)." },
		{ id: "security", title: "Step 5 • Security & Access", desc: "Pick an available username, set a strong password (≥8 chars), and provide a recovery email. Username is checked live for availability." },
		{ id: "final", title: "Step 6 • Finalize & Join", desc: "System validates entries and provisions access. When complete, use Join Intellaris Family to finish onboarding." },
	];

	return (
		<div
			className="relative min-h-screen grid place-items-center px-4 py-10 bg-black text-white page-fade-in select-none"
			onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
			draggable={false}
		>
			<div className="w-full max-w-4xl">
				<div className="mb-8 grid place-items-center gap-3 text-center">
					<Image src="/logos/logo1.svg" alt="Intellaris" width={64} height={64} priority />
					<h1 className="text-2xl font-semibold mt-10">Help Center • Setup Onboarding</h1>
					<p className="text-sm text-zinc-400">A step-by-step guide for our families</p>
				</div>

				<div className="mb-6 flex items-center justify-between gap-3">
					<Link href="/setup" className="inline-flex">
						<Button variant="secondary" className="h-9 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 cursor-pointer">
							<span className="flex items-center gap-2">Back to Setup <ChevronRight className="h-4 w-4" /></span>
						</Button>
					</Link>
					<nav aria-label="Contents" className="text-xs">
						<ol className="hidden sm:flex flex-wrap items-center gap-3 text-zinc-300">
							{sections.map((s) => (
								<li key={s.id}>
									<a href={`#${s.id}`} className="underline underline-offset-4 hover:text-white cursor-pointer">{s.title.replace(/^[^•]+•\s*/, "")}</a>
								</li>
							))}
						</ol>
					</nav>
				</div>

				<Card className="bg-black/40 border-white/10 p-5 md:p-6">
					<div className="grid gap-8">
						<section id="overview" className="grid gap-3">
							<h2 className="text-lg font-medium text-white">Overview</h2>
							<p className="text-sm text-zinc-300">
								Our setup journey is organized into 7 stages: Verify, Profile, HR, Policies, Work, Security, and Finalize.
							</p>
							<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
								<li><span className="text-white">Employees</span>: complete every step to provision your intranet access and payroll readiness.</li>
								<li><span className="text-white">Families</span>: add emergency contact details and provide documents during HR stage for benefits eligibility where applicable.</li>
							</ul>
						</section>

						{sections.map((s) => (
							<section key={s.id} id={s.id} className="grid gap-2 scroll-mt-24">
								<h3 className="text-base font-semibold text-white">{s.title}</h3>
								<p className="text-sm text-zinc-300">{s.desc}</p>
								{(() => {
									switch (s.id) {
										case "verify":
											return (
												<ul className="text-sm text-zinc-300 list-decimal pl-5 grid gap-1">
													<li>Enter your registered 10-digit phone number.</li>
													<li>If you don't have an OTP, click Send Code. Wait for the cooldown to complete before resending.</li>
													<li>When you receive the OTP, enter the 6 characters (letters or digits) and verify.</li>
												</ul>
											);
										case "profile":
											return (
												<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
													<li>Provide accurate <span className="text-white">Full Name</span> and <span className="text-white">Work Email</span> (required).</li>
													<li>Fill <span className="text-white">Job Title</span>, <span className="text-white">Department</span>, and <span className="text-white">Reporting Manager</span>.</li>
													<li>Set <span className="text-white">Location</span> (Office, Remote, Hybrid) and <span className="text-white">Address</span>.</li>
													<li>Optionally add a <span className="text-white">secondary mobile</span> for alerts/2FA.</li>
													<li>Upload a clear profile photo when prompted later; you can preview it.</li>
												</ul>
											);
										case "hr":
											return (
												<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
													<li>Enter <span className="text-white">PAN</span> and <span className="text-white">Aadhar</span> exactly as on your documents.</li>
													<li>Provide <span className="text-white">Bank details</span> for payroll: holder name, account number, IFSC.</li>
													<li>Summarize <span className="text-white">previous employment</span> if any.</li>
													<li>Upload the <span className="text-white">last 3 salary slips</span> as requested.</li>
													<li><span className="text-white">Families</span>: include an emergency contact person, relationship, phone, and address so HR can set up benefits communications if applicable.</li>
												</ul>
											);
										case "policies":
											return (
												<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
													<li>Review and accept: Code of Conduct, Leave Policy, IT Usage, Confidentiality, Location, Data Privacy.</li>
													<li>All must be accepted to continue; use Read more to view details when available.</li>
												</ul>
											);
										case "work":
											return (
												<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
													<li>Select your <span className="text-white">joining date</span> on the calendar.</li>
													<li>Set <span className="text-white">preferred work hours</span> start and end.</li>
													<li>Confirm <span className="text-white">time zone</span> and <span className="text-white">notification</span> channels.</li>
												</ul>
											);
										case "security":
											return (
												<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
													<li>Choose a <span className="text-white">username</span>; the system shows availability in real-time.</li>
													<li>Create a <span className="text-white">strong password</span> (≥ 8 characters) and confirm it.</li>
													<li>Add a <span className="text-white">recovery email</span> for account recovery.</li>
												</ul>
											);
										case "final":
											return (
												<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
													<li>System runs final checks and provisions access. This can take up to ~10 seconds.</li>
													<li>When complete, click <span className="text-white">Join Intellaris Family</span> to enter the intranet.</li>
												</ul>
											);
										default:
											return null;
									}
								})()}
							</section>
						))}

						<section id="network-security" className="grid gap-2 scroll-mt-24">
							<h3 className="text-base font-semibold">Network, Security, and IP indicators</h3>
							<p className="text-sm text-zinc-300">During setup we show network connectivity, security state (Secure/Hardened), and your public IP/provider to help diagnose access issues.</p>
							<ul className="text-sm text-zinc-300 list-disc pl-5 grid gap-1">
								<li><span className="text-white">Online/Offline</span>: if offline, reconnect and retry actions.</li>
								<li><span className="text-white">Secure/Hardened</span>: HTTPS and secure context; Hardened includes CSP or active Service Worker.</li>
								<li><span className="text-white">Provider/IP</span>: used for auditing and support.</li>
							</ul>
						</section>

						<section id="faq" className="grid gap-3 scroll-mt-24 text-white">
							<h3 className="text-base font-semibold">FAQs</h3>
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="otp">
									<AccordionTrigger>OTP not received or expired</AccordionTrigger>
									<AccordionContent>
										<ul className="list-disc pl-5 grid gap-1 text-sm text-zinc-300">
											<li>Wait for the cooldown timer to finish, then click Send Code again.</li>
											<li>Check network signal and ensure your number is correct.</li>
										</ul>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="docs">
									<AccordionTrigger>What documents are needed for HR?</AccordionTrigger>
									<AccordionContent>
										<p className="text-sm text-zinc-300">PAN, Aadhar, bank details for payroll, prior employment summary, and last 3 salary slips. Families should be ready with emergency contact details.</p>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="policies">
									<AccordionTrigger>Do I need to accept all policies?</AccordionTrigger>
									<AccordionContent>
										<p className="text-sm text-zinc-300">Yes. All listed policies must be acknowledged to proceed. Use Read more to view details where available.</p>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="username">
									<AccordionTrigger>Choosing a username</AccordionTrigger>
									<AccordionContent>
										<p className="text-sm text-zinc-300">Avoid reserved names like admin, root, system, support, helpdesk. Use letters, numbers, dot, underscore, or dash; minimum 3 characters.</p>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="finalize">
									<AccordionTrigger>Finalize & access issues</AccordionTrigger>
									<AccordionContent>
										<p className="text-sm text-zinc-300">If the final check doesn’t complete after ~15s, refresh the page and try again. Ensure you are online and on HTTPS.</p>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</section>
					</div>
				</Card>

				<p className="mt-6 text-center text-xs text-zinc-500">Need more help? Contact HR or IT via the intranet support portal.</p>
			</div>

			{/* Bottom-left wordmark */}
			<div className="absolute left-6 sm:left-10 bottom-8 flex items-center gap-3">
				<div className="h-8 w-8 rounded-md border border-white/60 grid place-items-center">
					<ArrowRight className="h-4 w-4 text-white/85" strokeWidth={2} />
				</div>
				<span className="tracking-widest text-xl sm:text-2xl font-medium">REGLOOK.COM</span>
			</div>
		</div>
	);
}


