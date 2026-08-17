import Image from "next/image";
import Link from "next/link";

function AppHeader() {
  return (
    <div className="flex items-center justify-between py-6">
      <Image src={"/logo.png"} alt="Logo" width={36} height={36} />

      <div className="flex gap-12 text-sm text-foreground/60">
        <Link
          href={"#"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          Home
        </Link>
        <Link
          href={"#"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          About
        </Link>
        <Link
          href={"#"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          Projects
        </Link>
        <Link
          href={"#"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          Contact
        </Link>
      </div>

      <div></div>
    </div>
  );
}

export default AppHeader;
