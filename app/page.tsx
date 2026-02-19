import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Announce, Scroller } from "@/components/landing/scroller";
import { Stats } from "@/components/landing/stats";
import { Platform } from "@/components/landing/platform";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Writers } from "@/components/landing/writers";
import { Testimonials } from "@/components/landing/testimonials";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Announce />
      <main>
        <Hero />
        <Scroller />
        <Stats />
        <Platform />
        <HowItWorks />
        <Writers />
        <Testimonials />
        <Features />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
