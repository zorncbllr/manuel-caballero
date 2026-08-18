import vector0 from "@/app/assets/Vector.svg";
import vector1 from "@/app/assets/Vector-1.svg";
import vector2 from "@/app/assets/Vector-2.svg";
import vector3 from "@/app/assets/Vector-3.svg";
import vector4 from "@/app/assets/Vector-4.svg";
import vector5 from "@/app/assets/Vector-5.svg";
import vector6 from "@/app/assets/Vector-6.svg";
import vector7 from "@/app/assets/Vector-7.svg";
import vector8 from "@/app/assets/Vector-8.svg";
import vector9 from "@/app/assets/Vector-9.svg";
import vector10 from "@/app/assets/Vector-10.svg";
import vector11 from "@/app/assets/Vector-11.svg";
import vector12 from "@/app/assets/Vector-12.svg";
import vector13 from "@/app/assets/Vector-13.svg";
import vector14 from "@/app/assets/Vector-14.svg";
import vector15 from "@/app/assets/Vector-15.svg";
import vector16 from "@/app/assets/Vector-16.svg";
import vector17 from "@/app/assets/Vector-17.svg";
import vector18 from "@/app/assets/Vector-18.svg";
import vector19 from "@/app/assets/Vector-19.svg";
import vector20 from "@/app/assets/Vector-20.svg";
import vector21 from "@/app/assets/Vector-21.svg";
import vector22 from "@/app/assets/Vector-22.svg";
import vector23 from "@/app/assets/Vector-23.svg";
import vector24 from "@/app/assets/Vector-24.svg";
import vector25 from "@/app/assets/Vector-25.svg";
import vector26 from "@/app/assets/Vector-26.svg";
import vector27 from "@/app/assets/Vector-27.svg";
import vector28 from "@/app/assets/Vector-28.svg";
import vector29 from "@/app/assets/Vector-29.svg";
import Image from "next/image";

const TECH_STACK = [
  vector0,
  vector1,
  vector2,
  vector3,
  vector4,
  vector5,
  vector6,
  vector7,
  vector8,
  vector9,
  vector10,
  vector11,
  vector12,
  vector13,
  vector14,
  vector15,
  vector16,
  vector17,
  vector18,
  vector19,
  vector20,
  vector21,
  vector22,
  vector23,
  vector24,
  vector25,
  vector26,
  vector27,
  vector28,
  vector29,
];

function TeckStack() {
  return (
    <div className="space-y-2">
      <p className="font-medium">Tech Stack</p>
      <div className="flex flex-wrap gap-2">
        {TECH_STACK.map((src, index) => (
          <div
            key={index}
            className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5"
          >
            <Image
              src={src}
              alt="Tech stack logo"
              width={32}
              height={36}
              unoptimized
              className="size-6 object-contain invert"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeckStack;
