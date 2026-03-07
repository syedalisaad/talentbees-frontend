import ApplicationList from "@/src/components/master/frontend/ApplicationList";
import { promises } from "dns";
import React from "react";

export default function Page({ params }: { params: Promise <{ id: number }> }) {
  const jobId = React.use(params)
  return <ApplicationList jobId={jobId.id} />;
}