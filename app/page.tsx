import { MotionConfig } from "motion/react";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import ProcessSection from "./components/ProcessSection";
import ProjectsSection from "./components/ProjectsSection";
import CTASection from "./components/CTASection";
import WorkflowGraphic from "./components/WorkflowGraphic";

function HomePage() {
  return (
    <main className="flex flex-col px-40">
      <MotionConfig reducedMotion="user">
        <div className="space-y-16">
          <HeroSection />
        </div>

        <div className="mt-40 space-y-40">
          <WorkflowGraphic />
          <ServicesSection />
          <ProcessSection />
          <ProjectsSection />
          <CTASection />
        </div>
      </MotionConfig>
    </main>
  );
}

export default HomePage;
