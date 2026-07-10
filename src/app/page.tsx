import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Insight from "@/components/landing/Insight";
import HowItWorks from "@/components/landing/HowItWorks";
import SolutionGrid from "@/components/landing/SolutionGrid";
import ComparisonTable from "@/components/landing/ComparisonTable";
import ForWhom from "@/components/landing/ForWhom";
import FeatureNarratives from "@/components/landing/FeatureNarratives";
import DataSources from "@/components/landing/DataSources";
import Technology from "@/components/landing/Technology";
import OutputPreview from "@/components/landing/OutputPreview";
import Faq from "@/components/landing/Faq";
import Trust from "@/components/landing/Trust";
import ComingSoon from "@/components/landing/ComingSoon";
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
        <SolutionGrid />
        <ComparisonTable />
        <ForWhom />
        <FeatureNarratives />
        <DataSources />
        <Technology />
        <OutputPreview />
        <Faq />
        <Trust />
        <ComingSoon />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
