import Navbar from "./components/navbar";
import Header from "./components/header";
import DashboardGrid from "@/components/dashboard/dashboard-grid";
import EmployeeSection from "@/components/dashboard/employee-section";
import { Updates } from "@/components/dashboard/updates";

export default function HangarPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Header />
      {/* Add padding-top to account for fixed navbar (64px) + header (56px) = 120px */}
      <main className="container mx-auto px-4 py-8 space-y-8 pt-[180px]">
        <DashboardGrid />
        <EmployeeSection />
        <Updates />
      </main>
    </div>
  );
}
