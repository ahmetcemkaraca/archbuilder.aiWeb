import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Technology } from '@/components/sections/technology';
import { Pricing } from '@/components/sections/pricing';
import { CTA } from '@/components/sections/cta';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Technology />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}