import MatrixAnimation from "./MatrixAnimation";
import HeroButtons from "./HeroButtons";

function HeroSection() {
  return (
    <div className="gap-6 flex flex-col h-[60rem] justify-center">
      <div className="animate-hero-in -space-y-16">
        <h1 className="text-[8rem]">Automate. Integrate.</h1>
        <h1 className="text-[8rem]">Scale. </h1>
      </div>
      <div className="animate-hero-in [animation-delay:150ms] flex items-center gap-12 text-xl">
        <span>AI Solutions</span>
        <div className="p-1 bg-foreground rounded-full"></div>
        <span>Workflow Automations</span>
        <div className="p-1 bg-foreground rounded-full"></div>
        <span>Scalable Software Systems</span>
      </div>
      <div className="animate-hero-in [animation-delay:300ms]">
        <MatrixAnimation height={1920 / 5} />
      </div>

      <HeroButtons />
    </div>
  );
}

export default HeroSection;
