import CTA from "@/components/landingpage/CTA";
import Features from "@/components/landingpage/Features";
import Hero from "@/components/landingpage/Hero";
import Stats from "@/components/landingpage/Stats";
import Workflow from "@/components/landingpage/WorkFlow";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Hero />
      <Features/>
      <Stats/>
      <Workflow/>
      <CTA/>
    </div>
  );
}
