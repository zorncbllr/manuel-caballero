import AboutSection from "./components/AboutSection";
import AppHeader from "./components/AppHeader";
import HeroSection from "./components/HeroSection";

function HomePage() {
  return (
    <main className="flex flex-col px-40">
      <AppHeader />

      <div className="space-y-16">
        <HeroSection />
        <AboutSection />
      </div>
    </main>
  );
}

export default HomePage;
