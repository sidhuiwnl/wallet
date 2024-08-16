import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";


export default function Home() {
  return (
    <div className="w-screen h-screen bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          CRYWO
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          A place to generate crypto wallet done for cohort 3.0 as an assignment
        </p>
        <div className="flex flex-col items-center mt-5">
        <Link href={"/wallet"} className="z-10  px-8 py-2 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
          <div className="absolute -bottom-2 -right-2 bg-yellow-300 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
         <span className="relative font-bold">Wallet</span>
        </Link> 
        </div>
        
      </div>
      <BackgroundBeams/>
    </div>
  );
}
