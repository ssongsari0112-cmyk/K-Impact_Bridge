import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import SolutionGrid from "@/components/landing/SolutionGrid";
import Technology from "@/components/landing/Technology";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />
      <main className="flex-1">
        <SolutionGrid />
        <Technology />
      </main>
      <Footer />
    </div>
  );
}
