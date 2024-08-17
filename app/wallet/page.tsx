    'use client'

    import { generateMnemonic,mnemonicToSeed } from "bip39";
    import { Button } from "@/components/ui/button";
    import { derivePath } from "ed25519-hd-key";
    import { useEffect, useState } from "react";
    import { Card, CardContent } from "@/components/ui/card";
    import Navbar from "@/components/Navbar";
    import { Keypair } from "@solana/web3.js";
    import  { HDNodeWallet,ethers } from "ethers"
    
    

    const mnemoic = generateMnemonic();


    export default function Wallet(){
    
        const[showMnemoic,setShowMnemoic] = useState(false);
        const [seed,setSeed] = useState<Buffer | null>(null);
        const[walletCount,setWalletCount] = useState(0);
        
    useEffect(() =>{
        async function generateSeed(){
            if(!seed){
                const seed = await mnemonicToSeed(mnemoic);
            setSeed(seed)
            }
        }

        generateSeed()
    },[])

    function revealMnemonic(){
        
        setShowMnemoic(true);
        setWalletCount(prevWallets => prevWallets + 1);
    }
    
        return(
            <div className="w-screen h-screen ">
                <Navbar/>
                <div className="text-center">
                    <Button onClick={revealMnemonic}>Generate Secret </Button>
                </div>
            <div className="mt-5 w-[4xl] p-4">
                    {showMnemoic && (
                        <div className="space-y-2">
                        <Mnemoic mnemoicValue={mnemoic}/>
                        { seed && Array.from({length : walletCount},(_, i) =>(
                            <>
                             <SolVault key={i} seed={seed} walletIndex={i}/>
                             <EthVault seed={seed} walletIndex={i}/>
                            </>
                           
                        ))}
                        </div>
                        
                    )}
            </div>
            </div>
            
        )
    }

    function SolVault({seed, walletIndex} : {seed : Buffer,walletIndex : number}){
        
        const solpath = `m/44'/501'/${walletIndex}'/0'`;
        const derivedSeed = derivePath(solpath,seed.toString('hex')).key;
        const keypair = Keypair.fromSeed(Uint8Array.from(derivedSeed));
        const pubKey =  keypair.publicKey.toBase58();
        const privKey = Buffer.from(keypair.secretKey).toString('hex');
        return(
            <div>
                <h1>Wallet SOL : {walletIndex + 1}</h1>
                <h1>Public key</h1>
                {pubKey}
                {/* <h1>Private  key</h1>
                {privKey} */}
            </div>
        )
    }

    function EthVault({walletIndex,seed} : {walletIndex : number,seed : Buffer}){
        const ethPath = `m/44'/60'/${walletIndex}'/0`; 
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(ethPath);
        const privateKey = child.privateKey;
        const publicKey = child.publicKey;
        const hashedPub = ethers.computeAddress(publicKey);

        return (
            <div>
                <h1>Wallet ETH: {walletIndex + 1}</h1>
                <h1>Public key</h1>
                {hashedPub} 
                {/* <h1>Private  key</h1>
                {privateKey} */}
            </div>
        )
    }


    function Mnemoic({mnemoicValue} : {mnemoicValue : string}){
        return(
            <Card className="p-5 mb-10">
            <CardContent>
                <h1 className="mb-10">Current Secret</h1>
                {mnemoicValue ? mnemoicValue : ""}
            </CardContent>
        </Card>
        )
    }