import { Metadata } from "next";
import api from "@/src/lib/axios";
import JobsClientContent from "@/src/components/common/JobsClientContent";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. Await the params object (Required in Next.js 15)
  const resolvedParams = await params;
  
  // 2. Safely extract the slug (it might be undefined)
  const slugArray = resolvedParams?.slug;

  if (slugArray) {
    try {
      // 3. Fetch from Laravel
      const response = await api.get(`/public-job-by-slug/${slugArray}`);
      console.log(response)
      const job = response.data?.data;

      if (job) {
        const pageTitle = `${job.title} at ${job.company?.company_name}`;
        // Use optional chaining for city/country to prevent crashes if they are null
        const pageDesc = `Join ${job.company?.company_name} as a ${job.title} in ${job.city?.name || 'Remote'}, ${job.country?.name || ''}. ${job.description?.substring(0, 120)}...`;

        return {
          title: pageTitle,
          description: pageDesc,
          openGraph: {
            title: pageTitle,
            description: pageDesc,
            type: 'article',
            images: job.company?.logo_url ? [job.company.logo_url] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description: pageDesc,
          }
        };
      }
    } catch (e) {
      console.error("Metadata fetch error:", e);
    }
  }

  return {
    title: "Browse Jobs",
    description: "Explore the latest career opportunities in Pakistan, UAE, UK, and beyond on TalentBees.",
  };
}

  // Default SEO for the main Jobs page


export default function Page({ params }: Props) {
  return <JobsClientContent params={params} />;
}