import ApplicationList from "@/src/components/master/frontend/ApplicationList";
import React from "react";

export default function Page({ params }: { params: { id: number } }) {
  const jobId = React.use(params)
  return <ApplicationList jobId={jobId.id} />;
}