import Navbar from "@/src/components/master/frontend/Navbar";
import Footer from "@/src/components/master/frontend/Footer";
import "react-datepicker/dist/react-datepicker.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}