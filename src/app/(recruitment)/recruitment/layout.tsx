// app/(recruitment)/layout.tsx
import RecruitmentSidebar from "@/src/components/master/backend/RecruitmentSidebar";
import RecruitmentHeader from "@/src/components/master/backend/RecruitmentHeader";
import "react-datepicker/dist/react-datepicker.css";

export default function RecruitmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <RecruitmentSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <RecruitmentHeader />
        
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}