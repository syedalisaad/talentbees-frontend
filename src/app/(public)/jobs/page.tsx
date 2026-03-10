import Jobs from "@/src/components/common/job";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest Jobs",
  description: "Browse the latest job openings in Pakistan, UAE, UK, and USA on TalentBees.",
  keywords: ["Jobs in Pakistan", "UAE Careers", "UK Job Portal"],
};
export default function JobsPage() {
  return (
    <Jobs/>
  );
}