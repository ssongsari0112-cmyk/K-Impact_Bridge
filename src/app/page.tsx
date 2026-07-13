import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Insight from "@/components/landing/Insight";
import HowItWorks from "@/components/landing/HowItWorks";
import ForWhom from "@/components/landing/ForWhom";
import FeatureNarratives from "@/components/landing/FeatureNarratives";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Problem />
        <Insight />
        <HowItWorks />
        <ForWhom />
        <FeatureNarratives />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
