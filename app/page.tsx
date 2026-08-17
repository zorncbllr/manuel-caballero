import AppHeader from "./components/AppHeader";
import HeroSection from "./components/HeroSection";

function HomePage() {
  return (
    <main className="flex flex-col px-40">
      <AppHeader />
      <HeroSection />
    </main>
  );
}

export default HomePage;
