"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Palette from "@/components/Palette";
import InquiryForm from "@/components/InquiryForm";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <Services />
      <WhyChooseUs />
      <Palette />
      <Pricing />
      <Testimonials />
      <InquiryForm />
      <Footer />
    </main>
  );
}
