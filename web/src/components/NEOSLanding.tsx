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
        <div className="ambient-glow-blue top-1/4 left-1/4 w-96 h-96" />
        <div className="ambient-glow-orange bottom-1/4 right-1/4 w-80 h-80 animation-delay-1000" />
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
      <RoadmapSection />
      <TeamSection />
      <PartnersSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
