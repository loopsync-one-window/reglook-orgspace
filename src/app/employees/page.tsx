"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    MapPin,
    Phone,
    Shield,
    CreditCard,
    MessageSquare,
    Eye
} from "lucide-react";
import { format } from "date-fns";

// Types
interface Employee {
    id: string;
    full_name: string;
    work_email: string;
    job_title: string;
    department: string;
    location: string;
    phone_number: string;
    profile_image_url?: string;
    onboarding_status: string;
}

interface FullEmployeeData {
    employee: {
        id: string;
        full_name: string;
        work_email: string;
        job_title: string;
        department: string;
        location: string;
        phone_number: string;
        profile_image_url?: string;
        onboarding_status: string;
        // Sensitive Data
        pan?: string;
        aadhar?: string;
        bank_account_holder_name?: string;
        bank_account_number?: string;
        ifsc?: string;
        address_line?: string;
        date_of_birth?: string;
        username?: string;
    };
    chats: Array<{
        id: string;
        participant_name: string;
        participant_avatar?: string;
        messages: Array<{
            id: string;
            content: string;
            sender_id: string;
            created_at: string;
            is_read: boolean;
        }>;
    }>;
}

// Lock Screen Component
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "781318") {
            onUnlock();
        } else {
            setError(true);
            setPassword("");
        }
    };

    return (
        <div className="min-h-screen grid place-items-center bg-[#0C0C0E] text-white p-6">
            <div className="w-full max-w-sm flex flex-col items-center space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 bg-white/5 rounded-2xl grid place-items-center mb-2 ring-1 ring-white/10 shadow-2xl">
                        <Shield className="h-8 w-8 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Restricted Access</h1>
                    <p className="text-gray-500 text-sm text-center max-w-[280px]">
                        This page is protected. Please enter the secure access code to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="space-y-2">
                        <input
                            type="password"
                            autoFocus
                            placeholder=""
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(false);
                            }}
                            className={`w-full h-12 bg-[#1C1C1E] rounded-xl border px-4 text-center font-mono text-lg tracking-widest outline-none focus:ring-2 focus:ring-transparent transition-all ${error
                                ? "border-red-500/50 text-red-400 placeholder:text-red-400/50"
                                : "border-white/10 text-white placeholder:text-gray-600 focus:border-white/50"
                                }`}
                        />
                        {error && (
                            <p className="text-xs text-red-400 text-center font-medium animate-in fade-in slide-in-from-top-1">
                                Incorrect passcode. Please try again.
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 rounded-xl bg-white text-black hover:bg-gray-200 font-semibold transition-colors disabled:opacity-50"
                        disabled={password.length === 0}
                    >
                        Access Database
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function EmployeesPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [fullData, setFullData] = useState<FullEmployeeData | null>(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Auth State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    // Check Lock State
    useEffect(() => {
        const unlocked = localStorage.getItem("hq_unlocked");
        if (unlocked === "true") {
            setIsUnlocked(true);
        }
        setIsAuthChecking(false);
    }, []);

    // Unlock Handler
    const handleUnlock = () => {
        setIsUnlocked(true);
        localStorage.setItem("hq_unlocked", "true");
    };

    // Fetch Employees List
    useEffect(() => {
        if (!isUnlocked) return;

        const fetchEmployees = async () => {
            setLoading(true);
            try {
                // No auth token required for public endpoint
                const res = await fetch(`/api/v1/hq/employees?page=${page}&limit=20`);

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setEmployees(data.data.employees);
                        setHasMore(data.data.pagination.totalPages > page);
                    }
                } else {
                    console.error("Failed to fetch employees");
                }
            } catch (err) {
                console.error("Error fetching employees:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [page, router, isUnlocked]);

    // Fetch Full Data
    useEffect(() => {
        if (!selectedEmployeeId || !isUnlocked) {
            setFullData(null);
            return;
        }

        const fetchFullData = async () => {
            setDataLoading(true);
            try {
                // No auth token required for full data endpoint
                const res = await fetch(`/api/v1/hq/employees/${selectedEmployeeId}/full-data`);

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setFullData(data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching full data:", err);
            } finally {
                setDataLoading(false);
            }
        };

        fetchFullData();
    }, [selectedEmployeeId, isUnlocked]);

    if (isAuthChecking) return null; // Or a minimal spinner

    if (!isUnlocked) {
        return <LockScreen onUnlock={handleUnlock} />;
    }

    return (
        <div className="min-h-screen bg-[#0C0C0E] text-white font-sans selection:bg-blue-500/30 selection:text-blue-100">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#000]/30 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Manage and view employee records</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 disabled:opacity-50"
                            >
                                Previous
                            </Button>
                            <span className="text-xs font-medium text-gray-500 min-w-[3rem] text-center">Page {page}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={!hasMore || loading}
                                className="h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 disabled:opacity-50"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <Card className="border-none shadow-2xl bg-[#1C1C1E] rounded-2xl overflow-hidden ring-1 ring-white/5">
                    <Table>
                        <TableHeader className="bg-white/[0.02] border-b border-white/5">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="w-[80px] pl-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</TableHead>
                                <TableHead className="py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                                <TableHead className="py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</TableHead>
                                <TableHead className="py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</TableHead>
                                <TableHead className="py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right pr-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-white/5 last:border-0 hover:bg-transparent">
                                        <TableCell className="pl-6"><Skeleton className="h-10 w-10 rounded-full bg-white/10" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32 mb-1 bg-white/10" /><Skeleton className="h-3 w-24 bg-white/10" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-40 bg-white/10" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24 bg-white/10" /></TableCell>
                                        <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-16 ml-auto rounded-full bg-white/10" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                employees.map((emp) => (
                                    <TableRow
                                        key={emp.id}
                                        className="group hover:bg-white/[0.04] transition-colors border-b border-white/5 last:border-0 cursor-pointer"
                                        onClick={() => setSelectedEmployeeId(emp.id)}
                                    >
                                        <TableCell className="pl-6 py-4">
                                            <Avatar className="h-10 w-10 border border-white/10 shadow-sm">
                                                <AvatarImage src={emp.profile_image_url} alt={emp.full_name} />
                                                <AvatarFallback className="bg-[#2C2C2E] text-gray-400 text-xs font-medium">
                                                    {emp.full_name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="font-medium text-gray-200 group-hover:text-white transition-colors">{emp.full_name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{emp.department}</div>
                                        </TableCell>
                                        <TableCell className="py-4 hidden md:table-cell">
                                            <div className="text-sm text-gray-400 flex items-center gap-1.5 hover:text-gray-300">
                                                <Mail className="h-3 w-3" /> {emp.work_email}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                                <Phone className="h-3 w-3" /> {emp.phone_number}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 hidden sm:table-cell">
                                            <Badge variant="secondary" className="bg-[#2C2C2E] hover:bg-[#3A3A3C] text-gray-300 font-normal rounded-full px-3 border border-white/5 transition-colors">
                                                {emp.job_title}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 pr-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 font-medium rounded-full px-4 shadow-none border border-transparent hover:border-blue-500/30 transition-all group-hover:translate-x-[-4px]"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </main>

            {/* Full Data Sheet */}
            <Sheet open={!!selectedEmployeeId} onOpenChange={(open) => !open && setSelectedEmployeeId(null)}>
                <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0 border-l border-white/10 shadow-2xl bg-[#000000]">
                    <div className="hidden">
                        <SheetTitle>Employee Details</SheetTitle>
                    </div>
                    {dataLoading || !fullData ? (
                        <div className="h-full flex flex-col p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-20 w-20 rounded-full bg-white/10" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48 bg-white/10" />
                                    <Skeleton className="h-4 w-32 bg-white/10" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-full rounded-xl bg-white/10" />
                            <Skeleton className="h-64 w-full rounded-xl bg-white/10" />
                        </div>
                    ) : (
                        <div className="min-h-full flex flex-col">
                            {/* Sheet Header */}
                            <div className="relative bg-[#1C1C1E] pt-10 pb-8 px-8 border-b border-white/5">
                                <div className="flex flex-col items-center text-center">
                                    <Avatar className="h-24 w-24 border-4 border-[#2C2C2E] shadow-2xl mb-4">
                                        <AvatarImage src={fullData.employee.profile_image_url} />
                                        <AvatarFallback className="text-2xl bg-[#3A3A3C] text-gray-300 font-medium">{fullData.employee.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-2xl font-semibold text-white tracking-tight">{fullData.employee.full_name}</h2>
                                    <p className="text-gray-400 font-medium mt-1">{fullData.employee.job_title} · {fullData.employee.department}</p>

                                    <div className="flex gap-2 mt-5">
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-medium">
                                            {fullData.employee.onboarding_status}
                                        </Badge>
                                        <Badge variant="outline" className="text-gray-400 border-white/10 bg-white/5 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs">
                                            <MapPin className="h-3 w-3" /> {fullData.employee.location}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-6 space-y-8 bg-[#1C1C1E]">
                                {/* Sections */}
                                <div className="grid gap-6">
                                    {/* Personal Information */}
                                    <section>
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 pl-1">Personal Details</h3>
                                        <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 overflow-hidden">
                                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                                                <div className="p-4 space-y-1 hover:bg-white/[0.02] transition-colors">
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Date of Birth</p>
                                                    <p className="text-sm font-medium text-gray-200">{fullData.employee.date_of_birth ? format(new Date(fullData.employee.date_of_birth), 'MMMM d, yyyy') : 'N/A'}</p>
                                                </div>
                                                <div className="p-4 space-y-1 hover:bg-white/[0.02] transition-colors">
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Username</p>
                                                    <p className="text-sm font-medium text-gray-200">@{fullData.employee.username || 'unknown'}</p>
                                                </div>
                                            </div>
                                            <Separator className="bg-white/5" />
                                            <div className="p-4 space-y-1 hover:bg-white/[0.02] transition-colors">
                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Address</p>
                                                <p className="text-sm text-gray-200 leading-relaxed">{fullData.employee.address_line || 'No address provided'}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Sensitive Identifiers */}
                                    <section>
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                                            <Shield className="h-3 w-3 text-amber-500/80" />
                                            Official Identification
                                        </h3>
                                        <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                                            <div className="p-4 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">PAN Number</p>
                                                    <p className="text-sm font-bold text-gray-200 font-mono tracking-wider mt-0.5">{fullData.employee.pan || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Aadhar Number</p>
                                                    <p className="text-sm font-bold text-gray-200 font-mono tracking-wider mt-0.5">{fullData.employee.aadhar || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Financial Details */}
                                    <section>
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                                            <CreditCard className="h-3 w-3 text-purple-500/80" />
                                            Financial Information
                                        </h3>
                                        <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 overflow-hidden p-5 space-y-5">
                                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Bank Name</p>
                                                    <p className="text-sm font-medium text-gray-200">HDFC Bank</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">IFSC Code</p>
                                                    <p className="text-sm font-medium text-gray-200 font-mono">{fullData.employee.ifsc || 'N/A'}</p>
                                                </div>
                                                <div className="col-span-2 space-y-1 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Account Number</p>
                                                    <p className="text-lg font-bold text-gray-100 font-mono tracking-wider mt-0.5">{fullData.employee.bank_account_number || 'N/A'}</p>
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Account Holder</p>
                                                    <p className="text-sm font-medium text-gray-200">{fullData.employee.bank_account_holder_name || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Chats Section */}
                                    <section className="pb-10">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                                            <MessageSquare className="h-3 w-3 text-blue-500/80" />
                                            Recent Communications
                                        </h3>
                                        <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                                            {fullData.chats.length === 0 ? (
                                                <div className="p-10 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
                                                    <MessageSquare className="h-8 w-8 opacity-20" />
                                                    <p>No chat history available</p>
                                                </div>
                                            ) : (
                                                fullData.chats.map((chat) => (
                                                    <div key={chat.id} className="group">
                                                        <div className="bg-white/[0.02] p-4 flex items-center justify-between font-medium text-sm text-gray-300">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-7 w-7 ring-1 ring-white/10">
                                                                    <AvatarImage src={chat.participant_avatar} />
                                                                    <AvatarFallback className="text-[10px] bg-[#3A3A3C]">{chat.participant_name.substring(0, 2)}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-gray-200">Chat with {chat.participant_name}</span>
                                                            </div>
                                                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-500 font-medium">{chat.messages.length} msgs</span>
                                                        </div>
                                                        <div className="max-h-80 overflow-y-auto bg-[#151516] p-4 space-y-3 custom-scrollbar">
                                                            {chat.messages.map((msg) => (
                                                                <div
                                                                    key={msg.id}
                                                                    className={`flex flex-col ${msg.sender_id === fullData.employee.id ? 'items-end' : 'items-start'}`}
                                                                >
                                                                    <div
                                                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.sender_id === fullData.employee.id
                                                                            ? 'bg-blue-600 text-white rounded-br-sm'
                                                                            : 'bg-[#2C2C2E] text-gray-200 rounded-bl-sm'
                                                                            }`}
                                                                    >
                                                                        {msg.content}
                                                                    </div>
                                                                    <span className="text-[9px] text-gray-500 mt-1 px-1">
                                                                        {format(new Date(msg.created_at), 'p')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
