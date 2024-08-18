import Link from "next/link"
import { ModeToggle } from "./ui/mode-toggle"


export default function Navbar(){
    return(
        <div className="p-4 flex justify-between items-center">
            <div>
                <Link href={"/wallet"}className="md:text-6xl font-extrabold darK:text-white">CRYWO</Link>
            </div>
            <div>
                <ModeToggle/>
            </div>
        </div>
    )
}