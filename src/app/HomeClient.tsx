"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InteractiveBackground from "@/components/InteractiveBackground";
import AnimatedProgress from "@/components/AnimatedProgress";
import CareerPath from "@/components/CareerPath";
import OutcomeSection from "@/components/Stats";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import InteractiveSection from "@/components/InteractiveSection";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative transition-colors duration-500">
      <InteractiveBackground />
      <AnimatedProgress />
      <Header />
      <Hero />
      <InteractiveSection />
      {/* <ProblemSection /> */}
      {/* <SolutionSection /> */}
      <CareerPath />
      <Testimonials />
      {/* <OutcomeSection /> */}
      <Pricing />

      <FinalCTA />
      <Footer />
    </main>
  );
}
