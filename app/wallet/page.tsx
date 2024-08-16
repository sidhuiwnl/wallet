import { generateMnemonic } from "bip39";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

const mnemoic = generateMnemonic();


export default function Wallet(){
    
   
    return(
        <div className="w-screen h-screen ">
             <Navbar/>
            <div className="text-center">
                <Button>Generate Secret </Button>
            </div>
        </div>
        
    )
}


function Navbar(){
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