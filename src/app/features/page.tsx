import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import FeatureCards from "@/components/landing/FeatureCards";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />
      <main className="flex-1">
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
}
