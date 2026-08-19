import MatrixAnimation from "./MatrixAnimation";
import HeroButtons from "./HeroButtons";
import StatsCards from "./StatsCards";
import Image from "next/image";

function HeroSection() {
  return (
    <div className="gap-6 flex flex-col h-[56rem] justify-center">
      <div className="animate-hero-in flex gap-4 translate-y-4">
        <div className="w-18 relative h-20">
          <Image
            src="/profile.png"
            alt="Manuel Caballero"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div>
          <p className="text-2xl font-medium">Manuel Caballero</p>
          <p className="text-foreground/60">AI Solutions Engineer</p>
        </div>
      </div>

      <div className="-space-y-16">
        <h1 className="animate-hero-in text-[8rem]">Automate. Integrate.</h1>
        <h1 className="animate-hero-in [animation-delay:150ms] text-[8rem]">
          Scale.
        </h1>
      </div>
      <div className="-mt-6 flex items-center gap-12 text-xl">
        <span className="animate-hero-in [animation-delay:450ms]">
          AI Solutions
        </span>
        <div className="p-1 bg-foreground rounded-full"></div>
        <span className="animate-hero-in [animation-delay:550ms]">
          Workflow Automations
        </span>
        <div className="p-1 bg-foreground rounded-full"></div>
        <span className="animate-hero-in [animation-delay:650ms]">
          Scalable Software Systems
        </span>
      </div>
      <div className="relative animate-hero-in [animation-delay:800ms]">
        <MatrixAnimation height={1920 / 5.6} />
        <StatsCards />
      </div>

      <br />
      <HeroButtons />
    </div>
  );
}

export default HeroSection;
