import { useState } from 'react';
import { KindnessRipple } from './ui';
import { HeroSection } from './sections/HeroSection';
import {
  ProblemSection,
  PhilosophySection,
  SolutionSection,
  TokenomicsSection,
  EcosystemSection,
  Web3AuthSection,
  AlmaChatSection,
  TeamSection,
  PartnersSection,
  RoadmapSection,
  FAQSection,
  CTASection,
  Footer,
} from './sections/landing';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function NEOSLanding() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
    setRipples((prev) => [...prev, newRipple]);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div
      onClick={handleClick}
      className="min-h-screen text-white overflow-x-hidden relative font-montserrat"
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="ambient-glow-blue top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96" />
        <div className="ambient-glow-orange bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 animation-delay-1000" />
      </div>

      {/* Kindness Ripples */}
      {ripples.map((r) => (
        <KindnessRipple
          key={r.id}
          x={r.x}
          y={r.y}
          onComplete={() => removeRipple(r.id)}
        />
      ))}

      {/* Sections */}
      <HeroSection />
      <ProblemSection />
      <PhilosophySection />
      <SolutionSection />
      <TokenomicsSection />
      <EcosystemSection />
      <Web3AuthSection />
      <AlmaChatSection />
      <RoadmapSection />
      <TeamSection />
      <PartnersSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
