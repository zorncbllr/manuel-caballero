import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TechStack from "../components/TechStack";

function AboutPage() {
  return (
    <section className="flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-xl font-medium">About</h1>

        <div className="flex gap-6">
          <div className="rounded-2xl border w-80 h-100 border-white/10 overflow-hidden relative">
            <Image
              src="/profile.png"
              alt="Manuel Caballero"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="w-195 space-y-4 rounded-2xl p-8 border-white/10 border">
              <div className="flex justify-between">
                <div>
                  <p className="text-2xl font-medium">Manuel Caballero</p>
                  <p className="text-foreground/60">AI Solutions Engineer</p>
                </div>

                <ArrowUpRight width={24} />
              </div>

              <p className="text-foreground/60 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Placeat enim ipsum odit numquam temporibus, nobis consectetur
                hic nihil facere dolore dolorum nemo culpa quo fugiat tempore
                hic nihil facere dolore dolorum nemo culpa quo fugiat tempore.
                hic nihil facere dolore dolorum nemo.
              </p>

              <Button className={"px-6 rounded-full"}>Let's Talk</Button>

              <hr />

              <TechStack />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
