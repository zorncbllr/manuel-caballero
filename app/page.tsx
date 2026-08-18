import HeroSection from "./components/HeroSection";

function HomePage() {
  return (
    <main className="flex flex-col px-40">
      <div className="space-y-16">
        <HeroSection />
      </div>
    </main>
  );
}

export default HomePage;
