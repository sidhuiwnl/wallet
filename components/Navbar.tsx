import { ModeToggle } from "./ui/mode-toggle"


export default function Navbar(){
    return(
        <div className="p-4 flex justify-between items-center">
            <div>
                <h1 className="md:text-6xl font-extrabold darK:text-white">CRYWO</h1>
            </div>
            <div>
                <ModeToggle/>
            </div>
        </div>
    )
}