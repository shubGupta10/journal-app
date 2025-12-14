"use client";

import { FeaturesSection } from "@/components/landingPage/FeaturesSection";
import { FinalCTASection } from "@/components/landingPage/FinalCTASection";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { TestimonialsSection } from "@/components/landingPage/TestimonialsSection";
import { WhySection } from "@/components/landingPage/WhySection";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <WhySection />
      <FeaturesSection />
      <TestimonialsSection />
      <FinalCTASection />
    </div>
  );
}
