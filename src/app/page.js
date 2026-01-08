"use client";
import Features from "@/components/landingpage/Features";
import Hero from "@/components/landingpage/Hero";
import Stats from "@/components/landingpage/Stats";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Hero />
      <Features/>
      <Stats/>
    </div>
  );
}
