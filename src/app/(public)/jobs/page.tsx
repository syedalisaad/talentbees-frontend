"use client";

import JobsListContent from "@/src/components/master/frontend/JobsListContent";
import React, {  Suspense } from "react";



// 1. Move the main logic into a sub-component

// 2. Export the component wrapped in Suspense for the Build process
export default function JobsPage() {
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