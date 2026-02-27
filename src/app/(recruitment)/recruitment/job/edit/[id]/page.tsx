"use client";

import { useParams } from "next/navigation";
import PostJobForm from "../../create/page";

export default function EditJobPage() {
  const params = useParams();
  
  // Ensure 'id' matches the folder name in your [id] dynamic route
  const jobId = params.id as string; 

  return <PostJobForm jobId={jobId} />;
}