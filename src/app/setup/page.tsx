"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Globe, ShieldAlert, ShieldCheck, Wifi, WifiOff, ArrowRight, ChevronDown, CheckCircle, XCircle, Loader2, User, X, ExternalLink } from "lucide-react";

// Define TypeScript interfaces for our API responses
interface PreviousEmploymentDetails {
  details: string;
}

interface OnboardingFields {
  address_line: string;
  secondary_phone_number: string;
  pan: string;
  aadhar: string;
  other_tax_id: string;
  bank_account_holder_name: string;
  bank_account_number: string;
  ifsc: string;
  previous_employment_details: string | PreviousEmploymentDetails;
  last_3_salary_slips: string[];
  date_of_birth: string;
  preferred_working_hours: string;
  time_zone: string;
  notification_preferences: {
    sms: boolean;
    email: boolean;
  };
  username: string;
  recovery_email: string;
}

interface EmployeeData {
  phone_number: string;
  full_name: string;
  work_email: string;
  job_title: string;
  department: string;
  reporting_manager: string;
  location: string;
  profile_image_url: string;
  onboarding_fields: OnboardingFields;
  onboarding_status: string;
}

interface ApiResponse {
  success: boolean;
  status?: string; // Added to handle the "status" field in the response
  mode?: string;
  message?: string;
  employee_id?: string;
  username?: string;
  employee?: EmployeeData;
  error?: {
    message: string;
    stack: string;
  };
}

export default function SetupPage() {
  const [online, setOnline] = useState<boolean>(true);
  const [downlinkMbps, setDownlinkMbps] = useState<number | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);
  const [secureStatus, setSecureStatus] = useState<"secure" | "hardened" | "insecure">("insecure");
  const [secureNote, setSecureNote] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [errors, setErrors] = useState<{ phone?: string; otp?: string; api?: string }>({});
  const [currentStep, setCurrentStep] = useState<"verify" | "profile" | "hr" | "policies" | "work" | "security" | "final">("verify");
  const [saving, setSaving] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [manager, setManager] = useState<string>("");
  const [locationType, setLocationType] = useState<string>("");
  const [addressLine, setAddressLine] = useState<string>("");
  const [workEmail, setWorkEmail] = useState<string>("");
  const [mobileAlerts, setMobileAlerts] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Employee data from API
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  // OTP send cooldown (applies only to "Send Code" mode)
  const [sendCooldown, setSendCooldown] = useState<boolean>(false);
  const [sendCooldownSeconds, setSendCooldownSeconds] = useState<number>(0);
  const sendCooldownTimerRef = useRef<any>(null);
  const sendCooldownIntervalRef = useRef<any>(null);

  // Step 2: HR & Admin Info state
  const [emergencyName, setEmergencyName] = useState<string>("");
  const [emergencyRelation, setEmergencyRelation] = useState<string>("");
  const [emergencyPhone, setEmergencyPhone] = useState<string>("");
  const [emergencyAddress, setEmergencyAddress] = useState<string>("");

  const [bankHolderName, setBankHolderName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankIfsc, setBankIfsc] = useState<string>("");
  const [bankBranch, setBankBranch] = useState<string>("");

  const [pan, setPan] = useState<string>("");
  const [aadhar, setAadhar] = useState<string>("");
  const [otherTaxId, setOtherTaxId] = useState<string>("");
  const [previousEmployment, setPreviousEmployment] = useState<string>("");

  const [hrDocuments, setHrDocuments] = useState<File[]>([]);
  const [salarySlips, setSalarySlips] = useState<string[]>([]); // Store uploaded salary slip URLs
  const [salarySlipFiles, setSalarySlipFiles] = useState<(File | null)[]>([null, null, null]); // Store selected files for each slip
  const [hrPolicies, setHrPolicies] = useState<{ codeOfConduct: boolean; leavePolicy: boolean; itUsage: boolean; confidentiality: boolean; remoteWork: boolean; dataPrivacy: boolean }>({ codeOfConduct: false, leavePolicy: false, itUsage: false, confidentiality: false, remoteWork: false, dataPrivacy: false });
  const [savingHr, setSavingHr] = useState<boolean>(false);
  const [savingPolicies, setSavingPolicies] = useState<boolean>(false);
  const [savingWork, setSavingWork] = useState<boolean>(false);

  // Step 4: Work Preferences
  const [workDate, setWorkDate] = useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [workHoursStart, setWorkHoursStart] = useState<string>("09:00");
  const [workHoursEnd, setWorkHoursEnd] = useState<string>("18:00");
  const [timeZone, setTimeZone] = useState<string>(typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC");
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [notifyIntranet, setNotifyIntranet] = useState<boolean>(true);
  const [notifyMobile, setNotifyMobile] = useState<boolean>(false);

  // Step 5: Security & Access
  const [username, setUsername] = useState<string>("");
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [recoveryEmail, setRecoveryEmail] = useState<string>("");
  const [savingSecurity, setSavingSecurity] = useState<boolean>(false);

  // Profile preview modal state
  const [profilePreviewOpen, setProfilePreviewOpen] = useState<boolean>(false);

  // Step 6: Final validation state
  const [finalChecking, setFinalChecking] = useState<boolean>(false);
  const [finalDone, setFinalDone] = useState<boolean>(false);
  const [completingSetup, setCompletingSetup] = useState<boolean>(false);

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

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) connection.removeEventListener?.("change", setConnectionInfo);
      if (ipInterval) clearInterval(ipInterval);
    };
  }, []);

  // Animate avatar preview in/out
  const openProfilePreview = () => setProfilePreviewOpen(true);
  const closeProfilePreview = () => setProfilePreviewOpen(false);

  // Cleanup cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (sendCooldownTimerRef.current) {
        clearTimeout(sendCooldownTimerRef.current);
      }
      if (sendCooldownIntervalRef.current) {
        clearInterval(sendCooldownIntervalRef.current);
      }
    };
  }, []);

  // Debounced username availability check (using API)
  useEffect(() => {
    let timer: any;
    if (!username) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }
    setCheckingUsername(true);
    timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://orgspace.reglook.com/api/v1/intranet/auth/check-username/${username}`);
        const data = await response.json();

        if (data.success) {
          setUsernameAvailable(data.available);
        } else {
          setUsernameAvailable(false);
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
        setUsernameAvailable(false);
      }
      setCheckingUsername(false);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [username]);

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

  const validate = () => {
    const next: { phone?: string; otp?: string } = {};
    if (!/^\d{10}$/.test(phone)) {
      next.phone = "Enter a valid 10-digit phone number";
    }
    if (!/^[A-Za-z0-9]{6}$/.test(otp)) {
      next.otp = "Code must be 6 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Function to call the employee onboarding API
  const fetchEmployeeData = async (phoneNumber: string) => {
    try {
      const response = await fetch("https://orgspace.reglook.com/api/v1/intranet/employees/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          action: "fetch"
        })
      });

      const data: ApiResponse = await response.json();

      // Handle error cases - check both success and status fields
      if (!data.success && data.status !== "success") {
        if (data.error?.message) {
          setErrors(prev => ({ ...prev, api: data.error!.message }));
        } else if (data.message) {
          setErrors(prev => ({ ...prev, api: data.message }));
        }
        return false;
      }

      // Handle success cases
      if (data.mode === "already_completed" || data.status === "already_completed") {
        // Employee has already completed onboarding - redirect to SSO login page
        window.location.href = "/sso";
        return false;
      }

      if ((data.mode === "fetch" || data.status === "success") && data.employee?.onboarding_status === "PENDING") {
        // Successfully fetched employee data for onboarding
        setEmployeeData(data.employee);

        // Pre-fill form fields with employee data
        setFullName(data.employee.full_name || "");
        setJobTitle(data.employee.job_title || "");
        setDepartment(data.employee.department || "");
        setManager(data.employee.reporting_manager || "");
        setLocationType(data.employee.location || "");
        setAddressLine(data.employee.onboarding_fields?.address_line || "");
        setWorkEmail(data.employee.work_email || "");
        setMobileAlerts(data.employee.onboarding_fields?.secondary_phone_number || "");

        // Set profile image if available
        if (data.employee.profile_image_url) {
          setPhotoPreview(data.employee.profile_image_url);
        }

        // Set other fields from onboarding_fields
        setBankHolderName(data.employee.onboarding_fields?.bank_account_holder_name || "");
        setBankAccountNumber(data.employee.onboarding_fields?.bank_account_number || "");
        setBankIfsc(data.employee.onboarding_fields?.ifsc || "");
        setPan(data.employee.onboarding_fields?.pan || "");
        setAadhar(data.employee.onboarding_fields?.aadhar || "");
        setOtherTaxId(data.employee.onboarding_fields?.other_tax_id || "");
        // Handle previous_employment_details as either a string or an object with a details property
        const prevEmployment = data.employee.onboarding_fields?.previous_employment_details;
        if (typeof prevEmployment === 'object' && prevEmployment !== null) {
          setPreviousEmployment(prevEmployment.details || "");
        } else {
          setPreviousEmployment(prevEmployment || "");
        }
        setUsername(data.employee.onboarding_fields?.username || "");
        setRecoveryEmail(data.employee.onboarding_fields?.recovery_email || "");

        // Move to the profile step
        setCurrentStep("profile");
        return true;
      }

      return false;
    } catch (error) {
      console.error("API Error:", error);
      setErrors(prev => ({ ...prev, api: "Failed to connect to the server. Please try again." }));
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const isOtpValid = /^[A-Za-z0-9]{6}$/.test(otp);
    // Always require a valid phone number
    const phoneOk = /^\d{10}$/.test(phone);
    if (!phoneOk) {
      setErrors({ phone: "Enter a valid 10-digit phone number" });
      return;
    }
    // If OTP is valid, we're in Verify mode; else we're in Send Code mode
    if (!isOtpValid) {
      // Send Code mode: clear any entered OTP and simulate sending
      setOtp("");
      setErrors({});
      setSubmitting(true);
      // Start 10s cooldown for Send Code
      setSendCooldown(true);
      setSendCooldownSeconds(10);
      if (sendCooldownTimerRef.current) clearTimeout(sendCooldownTimerRef.current);
      if (sendCooldownIntervalRef.current) clearInterval(sendCooldownIntervalRef.current);
      // Safety timeout to ensure cooldown ends at 10s
      sendCooldownTimerRef.current = setTimeout(() => {
        setSendCooldown(false);
        setSendCooldownSeconds(0);
        if (sendCooldownIntervalRef.current) clearInterval(sendCooldownIntervalRef.current);
      }, 10000);
      // Interval to decrement seconds every second
      sendCooldownIntervalRef.current = setInterval(() => {
        setSendCooldownSeconds((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next === 0) {
            setSendCooldown(false);
            if (sendCooldownTimerRef.current) clearTimeout(sendCooldownTimerRef.current);
            if (sendCooldownIntervalRef.current) clearInterval(sendCooldownIntervalRef.current);
          }
          return next;
        });
      }, 1000);
      setTimeout(() => {
        setSubmitting(false);
        // stay on the same step; user will enter the received OTP
      }, 1200);
      return;
    }

    // Verify mode - Call the API to fetch employee data
    setErrors({});
    setSubmitting(true);

    try {
      const success = await fetchEmployeeData(phone);
      // Step transition is now handled in fetchEmployeeData
    } catch (error) {
      setErrors(prev => ({ ...prev, api: "An unexpected error occurred. Please try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  const onSelectPhoto = (file: File | null) => {
    setPhotoFile(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    if (file) setPhotoPreview(URL.createObjectURL(file));
    else setPhotoPreview(null);
  };

  const onSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!fullName || !workEmail || !addressLine || !mobileAlerts) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      console.log("Profile saved");
      setCurrentStep("hr");
    }, 1500);
  };

  const onSelectHrDocuments = (files: FileList | null) => {
    const selected = files ? Array.from(files) : [];
    setHrDocuments(selected);
  };

  const onSubmitHr = (e: React.FormEvent) => {
    e.preventDefault();
    if (savingHr) return;
    if (!pan || !aadhar || !bankHolderName || !bankAccountNumber || !bankIfsc) return;
    setSavingHr(true);
    setTimeout(() => {
      setSavingHr(false);
      console.log("HR & Admin info saved");
      setCurrentStep("policies");
    }, 1500);
  };

  const onSubmitPolicies = (e: React.FormEvent) => {
    e.preventDefault();
    if (savingPolicies) return;
    const allAccepted = hrPolicies.codeOfConduct && hrPolicies.leavePolicy && hrPolicies.itUsage && hrPolicies.confidentiality && hrPolicies.remoteWork && hrPolicies.dataPrivacy;
    if (!allAccepted) return;
    setSavingPolicies(true);
    setTimeout(() => {
      setSavingPolicies(false);
      console.log("Policies accepted");
      setCurrentStep("work");
    }, 1200);
  };

  const onSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (savingWork) return;

    // Validate date of birth
    if (!workDate) {
      alert("Please select your date of birth");
      return;
    }

    // Check if person is at least 18 years old
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    if (workDate > eighteenYearsAgo) {
      alert("You must be at least 18 years old");
      return;
    }

    setSavingWork(true);
    setTimeout(() => {
      setSavingWork(false);
      console.log("Work preferences saved", { workDate, workHoursStart, workHoursEnd, timeZone, notifyEmail, notifyIntranet, notifyMobile });
      console.log("Date of birth formatted:", workDate ? workDate.toISOString().split('T')[0] : "");
      setCurrentStep("security");
    }, 1200);
  };

  const validateSecurity = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail);
    const passwordOk = password.length >= 8;
    const matchOk = password === confirmPassword;
    const usernameOk = Boolean(username) && usernameAvailable === true;
    return emailOk && passwordOk && matchOk && usernameOk;
  };

  const onSubmitSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (savingSecurity) return;
    if (!validateSecurity()) {
      // Provide specific feedback for username issues
      if (!username) {
        alert("Please enter a username");
        return;
      }
      if (usernameAvailable === false) {
        alert("Username is already taken. Please choose a different username.");
        return;
      }
      return;
    }
    setSavingSecurity(true);
    setTimeout(() => {
      setSavingSecurity(false);
      console.log("Security & Access saved", { username, recoveryEmail });
      setCurrentStep("final");
    }, 1500);
  };

  // Function to handle salary slip attachment
  const attachSalarySlip = (index: number) => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png'; // Accept only PDF and image files
    fileInput.style.display = 'none';

    // Handle file selection
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // Store the selected file
        const newFiles = [...salarySlipFiles];
        newFiles[index] = file;
        setSalarySlipFiles(newFiles);

        // In a real implementation, you would upload the file to S3 here
        // For now, we'll just simulate by adding a placeholder URL
        const newSlips = [...salarySlips];
        newSlips[index] = `https://s3.aws.com/slips/${file.name}`;
        setSalarySlips(newSlips);
      }
    };

    // Trigger the file dialog
    fileInput.click();
  };

  // Function to call the employee onboarding update API
  const updateEmployeeData = async () => {
    setCompletingSetup(true);
    try {
      // Validate IFSC code format (11 characters, first 4 alphabets, 5th character 0, last 6 alphanumeric)
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (bankIfsc && !ifscRegex.test(bankIfsc)) {
        console.error("Invalid IFSC code format. IFSC should be 11 characters with first 4 alphabets, 5th character 0, and last 6 alphanumeric.");
        alert("Invalid IFSC code format");
        setCompletingSetup(false);
        return;
      }

      // Validate date of birth
      if (!workDate) {
        alert("Date of birth is required");
        setCompletingSetup(false);
        return;
      }

      // Check if person is at least 18 years old
      const today = new Date();
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (workDate > eighteenYearsAgo) {
        alert("You must be at least 18 years old");
        setCompletingSetup(false);
        return;
      }

      // Check if username is available
      if (!username || usernameAvailable !== true) {
        alert("Please choose an available username");
        setCompletingSetup(false);
        return;
      }

      // Combine work hours into a single string
      const preferredWorkingHours = `${workHoursStart} - ${workHoursEnd}`;

      // Format date of birth
      const dateOfBirth = workDate.toISOString().split('T')[0];

      // Create the update fields object with all required fields
      const updateFields = {
        address_line: addressLine,
        secondary_phone_number: mobileAlerts,
        pan: pan,
        aadhar: aadhar,
        bank_account_holder_name: bankHolderName,
        bank_account_number: bankAccountNumber,
        ifsc: bankIfsc,
        previous_employment_details: { details: previousEmployment },
        last_3_salary_slips: salarySlips, // Include the salary slips
        date_of_birth: dateOfBirth,
        preferred_working_hours: preferredWorkingHours,
        time_zone: timeZone,
        notification_preferences: {
          email: notifyEmail,
          sms: notifyMobile
        },
        username: username,
        recovery_email: recoveryEmail,
        password: password
      };

      console.log("Sending update fields to backend:", updateFields);

      const response = await fetch("https://orgspace.reglook.com/api/v1/intranet/employees/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phone,
          action: "update",
          update_fields: updateFields
        })
      });

      const data = await response.json();
      console.log("API Response:", data); // Log the full response for debugging

      if (data.success || data.status === "success") {
        // On successful update, redirect to home page
        window.location.href = "/sso";
      } else {
        // Handle error
        const errorMessage = data.message || data.error?.message || "Unknown error occurred";
        console.error("Update failed:", errorMessage);
        alert(`Update failed: ${errorMessage}`);
        setCompletingSetup(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the server. Please try again.");
      setCompletingSetup(false);
    }
  };

  return (
    <div
      className="relative min-h-screen grid place-items-center px-4 pb-10 pt-20 sm:py-10 bg-black text-white page-fade-in select-none overflow-hidden"
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      draggable={false}
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-4 z-30">
        <button
          onClick={() => window.location.href = '/sso'}
          className="text-sm text-white font-semibold cursor-pointer bg-transparent border-none hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-colors duration-300 p-2"
        >
          SSO Login <ExternalLink className="inline-block h-4 text-white" />
        </button>
        {currentStep !== "verify" ? (
          <>
            <a href="/setup/help" className="text-sm text-white underline-offset-4 underline cursor-pointer">Help Center</a>
            <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-white/30 transition" onClick={openProfilePreview}>
              <AvatarImage src={photoPreview ?? undefined} alt="Profile" />
              <AvatarFallback className="bg-white/10 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </AvatarFallback>
            </Avatar>
          </>
        ) : null}
      </div>
      <div className={currentStep === "hr" ? "w-full max-w-6xl" : currentStep === "profile" || currentStep === "policies" || currentStep === "work" || currentStep === "security" || currentStep === "final" ? "w-full max-w-3xl" : "w-full max-w-md"}>
        <div className="mb-8 grid place-items-center gap-3 text-center">
          <Image src="/logos/logo1.svg" alt="Intellaris" width={64} height={64} priority />
          <h1 className="text-2xl font-semibold mt-10">Setup</h1>
          {currentStep === "verify" ? (
            <p className="text-sm text-zinc-400">Verify your registered phone number to start onboarding</p>
          ) : currentStep === "profile" ? (
            <p className="text-sm text-zinc-400">Step 1/6 • Personal Profile</p>
          ) : currentStep === "hr" ? (
            <p className="text-sm text-zinc-400">Step 2/6 • Banking & KYC Info</p>
          ) : currentStep === "policies" ? (
            <p className="text-sm text-zinc-400">Step 3/6 • Accept Key Policies</p>
          ) : currentStep === "work" ? (
            <p className="text-sm text-zinc-400">Step 4/6 • Work Preferences</p>
          ) : currentStep === "security" ? (
            <p className="text-sm text-zinc-400">Step 5/6 • Security & Access to Intranet</p>
          ) : (
            <p className="text-sm text-zinc-400">Step 6/6 • Finalize & Join</p>
          )}
        </div>

        {currentStep === "verify" ? (
          <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                placeholder="e.g. 9876543210"
                className="h-11 rounded-lg border-white/10 focus-visible:border-white/30"
              />
              {errors.phone ? <p className="text-xs text-red-400">{errors.phone}</p> : null}
            </div>



            <div className="grid gap-2">
              <Label htmlFor="otp">Enter Code</Label>
              <InputOTP
                id="otp"
                maxLength={6}
                value={otp}
                onChange={(val) => setOtp(val.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))}
                containerClassName="gap-2"
                className="data-[active=true]:ring-white/50"
              >
                <InputOTPGroup className="justify-between w-full">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="h-11 w-11 rounded-md bg-white/5 uppercase border-white/10" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {errors.otp ? <p className="text-xs text-red-400">{errors.otp}</p> : null}
            </div>

            {errors.api ? <p className="text-xs font-semibold text-red-400 text-center">{errors.api}</p> : null}

            <Button type="submit" disabled={submitting || (!/^[A-Za-z0-9]{6}$/.test(otp) && sendCooldown)} className="h-11 rounded-xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer mt-2">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                  <span>{/^[A-Za-z0-9]{6}$/.test(otp) ? "Verifying…" : "Sending…"}</span>
                </span>
              ) : (
                <span>{/^[A-Za-z0-9]{6}$/.test(otp) ? "Verify" : (sendCooldown ? `Resend in ${sendCooldownSeconds}s` : "Send Code")}</span>
              )}
            </Button>
          </form>
        ) : currentStep === "profile" ? (
          <form onSubmit={onSubmitProfile} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.full_name} />
                </div>



                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.job_title} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Department / Team</Label>
                  <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.department} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="manager">Reporting Manager</Label>
                  <Input id="manager" value={manager} onChange={(e) => setManager(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.reporting_manager} />
                </div>


              </div>

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="workEmail">Work Email</Label>
                  <Input id="workEmail" type="email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.work_email} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="addressLine">Address Line</Label>
                  <Input id="addressLine" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.address_line} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mobileAlerts">Secondary Mobile Number (alerts / 2FA)</Label>
                  <Input id="mobileAlerts" inputMode="numeric" maxLength={10} value={mobileAlerts} onChange={(e) => setMobileAlerts(e.target.value.replace(/[^\d]/g, "").slice(0, 10))} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.secondary_phone_number} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="h-11 rounded-lg border-white/10 focus-visible:border-white/30"
                    disabled={!!employeeData?.location} // Disable if prefilled from employee data
                  />
                </div>

              </div>


            </div>

            <Button type="submit" disabled={saving || !addressLine || !mobileAlerts} className="h-11 rounded-xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                  <span>Saving…</span>
                </span>
              ) : (
                <span>Save and continue</span>
              )}
            </Button>
          </form>
        ) : currentStep === "hr" ? (
          <form onSubmit={onSubmitHr} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3 items-start">
              {/* Left column - Emergency Contact */}
              <div className="grid gap-5">
                <div className="grid gap-2 pt-1">
                  <h3 className="text-lg font-medium">Tax Identification</h3>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input id="pan" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))} className="h-11 uppercase tracking-wider rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.pan} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aadhar">Aadhar</Label>
                  <Input id="aadhar" inputMode="numeric" maxLength={12} value={aadhar} onChange={(e) => setAadhar(e.target.value.replace(/[^\d]/g, "").slice(0, 12))} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.aadhar} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="otherTaxId">Other Tax ID (if relevant)</Label>
                  <Input id="otherTaxId" value={otherTaxId} onChange={(e) => setOtherTaxId(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.other_tax_id} />
                </div>
              </div>

              {/* Middle column - Bank + Tax IDs */}
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <h2 className="text-lg font-medium">Bank Details (for payroll)</h2>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bankHolderName">Account Holder Name</Label>
                  <Input id="bankHolderName" value={bankHolderName} onChange={(e) => setBankHolderName(e.target.value)} className="h-11 rounded-lg uppercase border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.bank_account_holder_name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bankAccountNumber">Account Number</Label>
                  <Input id="bankAccountNumber" inputMode="numeric" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value.replace(/[^\d]/g, ""))} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.bank_account_number} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bankIfsc">IFSC</Label>
                  <Input
                    id="bankIfsc"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase().slice(0, 11))}
                    className="h-11 uppercase tracking-wider rounded-lg border-white/10 focus-visible:border-white/30"
                    disabled={!!employeeData?.onboarding_fields?.ifsc}
                    maxLength={11}
                    placeholder="E.g. SBIN0001234"
                  />
                </div>
              </div>

              {/* Right column - Employment, Uploads, Policies */}
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <h2 className="text-lg font-medium">Previous Employment (if any)</h2>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="previousEmployment">Details</Label>
                  <Textarea id="previousEmployment" value={previousEmployment} onChange={(e) => setPreviousEmployment(e.target.value)} className="min-h-[120px] rounded-lg border-white/10 focus-visible:border-white/30" disabled={!!employeeData?.onboarding_fields?.previous_employment_details} />
                </div>

                <div className="grid gap-2 pt-2 justify-start items-start">
                  <div className="grid gap-2">
                    <Label htmlFor="hrDocuments">Upload Last 3 salary slips</Label>
                    <div className="text-sm text-zinc-400 mt-2">
                      Upload through the dashboard after HR validation and approval (if previously employed).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={savingHr || !pan || !aadhar || !bankHolderName || !bankAccountNumber || !bankIfsc} className="h-11 rounded-xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer">
              {savingHr ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                  <span>Saving…</span>
                </span>
              ) : (
                <span>Save and continue</span>
              )}
            </Button>
          </form>
        ) : currentStep === "policies" ? (
          <form onSubmit={onSubmitPolicies} className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Code of Conduct */}
              <div className="relative h-36 rounded-lg border border-white/10 overflow-hidden bg-black/70 shadow-lg shadow-black/40">
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-2 cursor-pointer">
                  <Checkbox id="policy-code" checked={hrPolicies.codeOfConduct} onCheckedChange={(v) => setHrPolicies(prev => ({ ...prev, codeOfConduct: Boolean(v) }))} className="data-[state=checked]:bg-white cursor-pointer data-[state=checked]:text-black" />
                  <Label htmlFor="policy-code" className="leading-6">Code of Conduct</Label>
                </div>
                <div className="h-full grid place-items-center">
                  <button type="button" className="text-sm text-zinc-300 underline hover:text-white">Read more</button>
                </div>
              </div>

              {/* Leave Policy */}
              <div className="relative h-36 rounded-lg border border-white/10 overflow-hidden bg-black/70 shadow-lg shadow-black/40">
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-2 cursor-pointer">
                  <Checkbox id="policy-leave" checked={hrPolicies.leavePolicy} onCheckedChange={(v) => setHrPolicies(prev => ({ ...prev, leavePolicy: Boolean(v) }))} className="data-[state=checked]:bg-white cursor-pointer data-[state=checked]:text-black" />
                  <Label htmlFor="policy-leave" className="leading-6">Leave Policy</Label>
                </div>
                <div className="h-full grid place-items-center">
                  <button type="button" className="text-sm text-zinc-300 underline hover:text-white">Read more</button>
                </div>
              </div>

              {/* IT Usage Policy */}
              <div className="relative h-36 rounded-lg border border-white/10 overflow-hidden bg-black/70 shadow-lg shadow-black/40">
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-2 cursor-pointer">
                  <Checkbox id="policy-it" checked={hrPolicies.itUsage} onCheckedChange={(v) => setHrPolicies(prev => ({ ...prev, itUsage: Boolean(v) }))} className="data-[state=checked]:bg-white cursor-pointer data-[state=checked]:text-black" />
                  <Label htmlFor="policy-it" className="leading-6">IT Usage Policy</Label>
                </div>
                <div className="h-full grid place-items-center">
                  <button type="button" className="text-sm text-zinc-300 underline hover:text-white">Read more</button>
                </div>
              </div>

              {/* Confidentiality Agreement */}
              <div className="relative h-36 rounded-lg border border-white/10 overflow-hidden bg-black/70 shadow-lg shadow-black/40">
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-2 cursor-pointer">
                  <Checkbox id="policy-conf" checked={hrPolicies.confidentiality} onCheckedChange={(v) => setHrPolicies(prev => ({ ...prev, confidentiality: Boolean(v) }))} className="data-[state=checked]:bg-white cursor-pointer data-[state=checked]:text-black" />
                  <Label htmlFor="policy-conf" className="leading-6">Confidentiality Agreement</Label>
                </div>
                <div className="h-full grid place-items-center">
                  <button type="button" className="text-sm text-zinc-300 underline hover:text-white">Read more</button>
                </div>
              </div>

              {/* Remote Work/Hybrid Policy */}
              <div className="relative h-36 rounded-lg border border-white/10 overflow-hidden bg-black/70 shadow-lg shadow-black/40">
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-2 cursor-pointer">
                  <Checkbox id="policy-remote" checked={hrPolicies.remoteWork} onCheckedChange={(v) => setHrPolicies(prev => ({ ...prev, remoteWork: Boolean(v) }))} className="data-[state=checked]:bg-white cursor-pointer data-[state=checked]:text-black" />
                  <Label htmlFor="policy-remote" className="leading-6">Location Policy</Label>
                </div>
                <div className="h-full grid place-items-center">
                  <button type="button" className="text-sm text-zinc-300 underline hover:text-white">Read more</button>
                </div>
              </div>

              {/* Data Privacy Policy */}
              <div className="relative h-36 rounded-lg border border-white/10 overflow-hidden bg-black/70 shadow-lg shadow-black/40">
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-2 cursor-pointer">
                  <Checkbox id="policy-privacy" checked={hrPolicies.dataPrivacy} onCheckedChange={(v) => setHrPolicies(prev => ({ ...prev, dataPrivacy: Boolean(v) }))} className="data-[state=checked]:bg-white cursor-pointer data-[state=checked]:text-black" />
                  <Label htmlFor="policy-privacy" className="leading-6">Data Privacy Policy</Label>
                </div>
                <div className="h-full grid place-items-center">
                  <button type="button" className="text-sm text-zinc-300 underline hover:text-white">Read more</button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={savingPolicies || !(hrPolicies.codeOfConduct && hrPolicies.leavePolicy && hrPolicies.itUsage && hrPolicies.confidentiality && hrPolicies.remoteWork && hrPolicies.dataPrivacy)}
              className="h-11 rounded-xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer"
            >
              {savingPolicies ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                  <span>Saving…</span>
                </span>
              ) : (
                <span>Accept and continue</span>
              )}
            </Button>
          </form>
        ) : currentStep === "work" ? (
          <form onSubmit={onSubmitWork} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-4">
                <Label>Date of Birth</Label>
                <div className="rounded-lg border border-white/10 bg-black/40 p-3">
                  {/* Month/Year Navigation */}
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center gap-4">
                      <select
                        value={calendarMonth.getMonth()}
                        onChange={(e) => {
                          const newDate = new Date(calendarMonth);
                          newDate.setMonth(parseInt(e.target.value));
                          setCalendarMonth(newDate);
                        }}
                        className="text-sm bg-black/60 border border-white/10 rounded px-4 py-1 text-white focus:border-white/30 focus:outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i} className="bg-black text-white">
                            {new Date(2024, i).toLocaleDateString('en', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                      <select
                        value={calendarMonth.getFullYear()}
                        onChange={(e) => {
                          const newDate = new Date(calendarMonth);
                          newDate.setFullYear(parseInt(e.target.value));
                          setCalendarMonth(newDate);
                        }}
                        className="text-sm bg-black/60 border border-white/10 rounded px-5 py-1 text-white focus:border-white/30 focus:outline-none"
                      >
                        {Array.from({ length: 100 }, (_, i) => {
                          const year = new Date().getFullYear() - 80 + i;
                          // Limit to years that would make person at least 18 years old
                          const maxYear = new Date().getFullYear() - 18;
                          return year <= maxYear ? year : null;
                        }).filter(year => year !== null).map(year => (
                          <option key={year} value={year} className="bg-black text-white">
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={workDate}
                    onSelect={(date) => setWorkDate(date ?? undefined)}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    className="rounded-md bg-black/60 text-white border border-white/10 p-2"
                    disabled={(date) => {
                      // Disable dates that would make person less than 18 years old
                      const today = new Date();
                      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                      return date > eighteenYearsAgo;
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="workHoursStart">Preferred Work Hours</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input id="workHoursStart" type="time" value={workHoursStart} onChange={(e) => setWorkHoursStart(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" />
                    <Input id="workHoursEnd" type="time" value={workHoursEnd} onChange={(e) => setWorkHoursEnd(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <select id="timeZone" value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="h-11 rounded-lg bg-black border border-white/10 px-3">
                    <option className="bg-black text-white" value={timeZone}>{timeZone}</option>
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label>Notification Preferences</Label>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4 grid gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox id="notif-email" checked={notifyEmail} onCheckedChange={(v) => setNotifyEmail(Boolean(v))} />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox id="notif-intranet" checked={notifyIntranet} onCheckedChange={(v) => setNotifyIntranet(Boolean(v))} />
                      <span>Intranet</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox id="notif-mobile" checked={notifyMobile} onCheckedChange={(v) => setNotifyMobile(Boolean(v))} />
                      <span>Mobile</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={savingWork} className="h-11 rounded-xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer">
              {savingWork ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                  <span>Saving…</span>
                </span>
              ) : (
                <span>Save and continue</span>
              )}
            </Button>
          </form>
        ) : currentStep === "security" ? (
          <form onSubmit={onSubmitSecurity} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2 items-start">
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.trim())}
                      className="h-11 rounded-lg pr-10 border-white/10 focus-visible:border-white/30"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      {checkingUsername ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                      ) : usernameAvailable === true ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : usernameAvailable === false ? (
                        <XCircle className="h-5 w-5 text-red-400" />
                      ) : null}
                    </div>
                  </div>
                  {usernameAvailable === false && (
                    <p className="text-xs text-red-400">Username is already taken. Please choose a different username.</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Set Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" />
                </div>
              </div>

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="recoveryEmail">Recovery Email</Label>
                  <Input id="recoveryEmail" type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 rounded-lg border-white/10 focus-visible:border-white/30" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={savingSecurity || !validateSecurity()} className="h-11 rounded-xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer">
              {savingSecurity ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                  <span>Saving…</span>
                </span>
              ) : (
                <span>Save Security</span>
              )}
            </Button>
          </form>
        ) : (
          <div className="grid gap-8">
            {/* Kick off final validation animation */}
            {(() => {
              if (!finalChecking && !finalDone) {
                setTimeout(() => setFinalChecking(true), 0);
                setTimeout(() => { setFinalDone(true); setFinalChecking(false); }, 10000);
              }
              return null;
            })()}

            <div className="grid gap-3 place-items-center text-center">
              {!finalDone ? (
                <>
                  <span className="iphone-spinner scale-100" aria-label="Validating" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                  <p className="text-sm text-white/80">Checking all fields, validating documents, and provisioning access…</p>
                </>
              ) : (
                <>
                  <span className="iphone-spinner scale-100" aria-label="Validating" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </span>
                </>
              )}
            </div>

            <div className="grid place-items-center">
              <button
                disabled={!finalDone || completingSetup}
                className={`inline-flex cursor-pointer h-11 items-center justify-center px-5 rounded-full font-semibold transition ${finalDone && !completingSetup ? "bg-white text-black hover:bg-white/90" : "bg-white/20 text-white/60 cursor-not-allowed"}`}
                onClick={updateEmployeeData}
              >
                {completingSetup ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="iphone-spinner scale-75" style={{ color: '#000' }} aria-label="Loading" role="status">
                      <div></div><div></div><div></div><div></div><div></div><div></div>
                      <div></div><div></div><div></div><div></div><div></div><div></div>
                    </span>
                    <span>Completing Setup…</span>
                  </span>
                ) : (
                  "Complete Setup"
                )}
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-zinc-500">Ensure all information entered is correct, as it will be used for validation and approval</p>
      </div>


      <Dialog open={profilePreviewOpen} onOpenChange={setProfilePreviewOpen}>
        <DialogContent className="sm:max-w-[480px] bg-black/40 border-white/10 backdrop-blur-md text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-white">Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="w-full grid place-items-center py-2">
            <Avatar className="h-64 w-64 md:h-80 md:w-80 ring-2 ring-white/30 shadow-2xl bg-black/20">
              <AvatarImage src={photoPreview ?? undefined} alt="Profile" />
              <AvatarFallback className="bg-white/10 flex items-center justify-center">
                <User className="h-16 w-16 md:h-20 md:w-20 text-white" />
              </AvatarFallback>
            </Avatar>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}