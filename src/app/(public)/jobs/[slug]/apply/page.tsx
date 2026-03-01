"use client";


import { useParams } from "next/navigation";
import CandidateProfileForm from "../../../candidate/profile/page";
import React from "react";

export default function EditJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);

  return <CandidateProfileForm jobSlug={resolvedParams.slug} />;
}