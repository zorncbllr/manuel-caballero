import MatrixAnimation from "./MatrixAnimation";
import HeroButtons from "./HeroButtons";

function HeroSection() {
  return (
    <div className="space-y-6">
      <div className="-space-y-16">
        <h1 className="text-[8rem]">Automate. Integrate.</h1>
        <h1 className="text-[8rem]">Scale. </h1>
      </div>
      <div className="flex items-center gap-12 text-xl">
        <span>AI Solutions</span>
        <div className="p-1 bg-foreground rounded-full"></div>
        <span>Workflow Automations</span>
        <div className="p-1 bg-foreground rounded-full"></div>
        <span>Scalable Software Systems</span>
      </div>
      <MatrixAnimation height={1920 / 4} />

      <HeroButtons />
    </div>
  );
}

export default HeroSection;
