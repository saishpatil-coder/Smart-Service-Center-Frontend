import CTASection from "@/components/landingpage/CTASection";
import Features from "@/components/landingpage/Features";
import Hero from "@/components/landingpage/Hero";
import HowItWorks from "@/components/landingpage/HowItWorks";
import SearchCenter from "@/components/landingpage/SearchCenter";
import Testimonials from "@/components/landingpage/Testimonials";
import TopCenters from "@/components/landingpage/TopCenters";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Hero />
      <SearchCenter />
      <TopCenters />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTASection />
    </div>
  );
}
