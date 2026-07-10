import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Pipeline from "@/components/landing/Pipeline";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />
      <main className="flex-1">
        <Pipeline />
      </main>
      <Footer />
    </div>
  );
}
