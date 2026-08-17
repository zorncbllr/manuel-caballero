import Image from "next/image";

function AboutSection() {
  return (
    <div className="h-[40rem]">
      <h1 className="text-[2.5rem]">About Me</h1>
      <div className="w-full h-[1px] bg-primary rounded-full"></div>

      <div className="flex justify-start gap-16">
        <Image
          src={"/profile.png"}
          alt="Profile Picture"
          width={400}
          height={400}
        />

        <div>
          <h1 className="text-[2rem]">Manuel Caballero</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia,
            ratione voluptatibus? Ullam, quia unde dolorem dolore, dicta quis at
            accusantium blanditiis esse exercitationem nemo aut molestias iusto
            dolorum sapiente modi!
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
