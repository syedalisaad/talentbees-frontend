"use client";

import JobsListContent from "@/src/components/master/frontend/JobsListContent";
import React, {  Suspense } from "react";


export default function Jobs() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
        </div>
      }
    >
      <JobsListContent />
    </Suspense>
  );
}