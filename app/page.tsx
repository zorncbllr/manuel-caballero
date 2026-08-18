import HeroSection from "./components/HeroSection";
import StatsCards from "./components/StatsCards";
import SystemsShowcase from "./components/SystemShowcase";

function HomePage() {
  return (
    <main className="flex flex-col px-40">
      <div className="space-y-16">
        <HeroSection />
        <StatsCards />
        <SystemsShowcase />
      </div>
    </main>
  );
}

export default HomePage;
