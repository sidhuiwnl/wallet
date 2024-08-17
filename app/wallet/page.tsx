'use client'

import { generateMnemonic,mnemonicToSeed } from "bip39";
import { Button } from "@/components/ui/button";
import { derivePath } from "ed25519-hd-key";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Keypair } from "@solana/web3.js";

const mnemoic = generateMnemonic();
let seed : Buffer | null = null;

export default function Wallet(){
   
    const[showMnemoic,setShowMnemoic] = useState(false);
    const [seedReady,setSeedReady] = useState(false);
    const[wallets,setWallets] = useState([1]);
    
   useEffect(() =>{
    async function generateSeed(){
        if(!seed){
            seed = await mnemonicToSeed(mnemoic);
           setSeedReady(true)
        }
    }

    generateSeed()
   },[])

   function revealMnemonic(){
    
    setShowMnemoic(true);
   }
   
    return(
        <div className="w-screen h-screen ">
            
            <div className="text-center">
                <Button onClick={revealMnemonic}>Generate Secret </Button>
            </div>
           <div className="mt-5 w-[4xl]">
                {showMnemoic && (
                    <>
                    <Mnemoic mnemoicValue={mnemoic}/>
                    {seedReady && seed && <Vault seed={seed} wallets={wallets[0]}/>}
                    </>
                    
                )}
           </div>
        </div>
        
    )
}

function Vault({seed, wallets} : {seed : Buffer,wallets : number}){
    
    const path = `m/44'/501'/${wallets}'/0'`;
    const derivedSeed = derivePath(path,seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(Uint8Array.from(derivedSeed));
    const pubKey =  keypair.publicKey.toBase58();
    const privKey = Buffer.from(keypair.secretKey).toString('hex');
    return(
        <div>
            <h1>Wallet:</h1>
            <h1>Public key</h1>
            {pubKey}
            <h1>Private  key</h1>
            {privKey}
        </div>
    )
}


function Mnemoic({mnemoicValue} : {mnemoicValue : string}){
    return(
        <Card>
        <CardContent className="space-y-3">
            <h1>Current Secret</h1>
            {mnemoicValue ? mnemoicValue : ""}
        </CardContent>
    </Card>
    )
}