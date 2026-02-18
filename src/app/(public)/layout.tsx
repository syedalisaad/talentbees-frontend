import Navbar from "@/src/components/master/frontend/Navbar";
import Footer from "@/src/components/master/frontend/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* min-grow ensures the footer stays at the bottom on short pages */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}