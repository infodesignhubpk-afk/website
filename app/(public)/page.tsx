import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { Industries } from "@/components/home/Industries";
import { Testimonials } from "@/components/home/Testimonials";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Design Hub | Branding, Printing & Signage Agency in Peshawar",
  description:
    "Design Hub is Peshawar's branding, printing, signage & digital marketing studio. Logos, identity, brochures, hoardings, 3D signage, vehicle wraps and Meta ads.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <WhyChooseUs />
      <PortfolioPreview />
      <ProcessSteps />
      <Industries />
      <Testimonials />
      <HomeFAQ />
      <FinalCTA />
    </>
  );
}
