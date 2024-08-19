'use client'

import Navbar from "@/components/Navbar"
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import DialogComponent from "@/components/WalletTransaction";
import Link from "next/link";
import  { ethers,HDNodeWallet } from "ethers"


interface WalletData {
    mnemonic: string;
    seed: string;
}

interface SolanaWallet {
    index: number;
    publicKey: string;
    privateKey: string;
}
interface EtheriumWallet {
    index: number;
    publicKey: string;
    privateKey: string;
}

interface EthWalletProps{
    wallets  : EtheriumWallet[];
}

interface SolWalletsProps {
    wallets: SolanaWallet[];
}


export default function Wallets(): JSX.Element {
    return (
        <>
            <Navbar />
            <Generate />
        </>
    )
}




function Generate(): JSX.Element {
    const [mnemonic, setMnemonic] = useState<string>("");
    const [seed, setSeed] = useState<Buffer | null>(null);
    const [solWallets, setSolWallets] = useState<SolanaWallet[]>([]);
    const [ethWallets,setEthWallets] = useState<SolanaWallet[]>([]);
    const [whichWallet,setWhichWallet] = useState("Solana");

    useEffect(() => {
        const storedData = localStorage.getItem("walletData");
        if (storedData) {
            const { mnemonic, seed } = JSON.parse(storedData) as WalletData;
            setMnemonic(mnemonic);
            setSeed(Buffer.from(seed,'hex'));
        }

        const storedWallets = localStorage.getItem("solWallets");
        const storedEthWallets = localStorage.getItem("ethWallets");
        if (storedWallets && storedEthWallets) {
            setSolWallets(JSON.parse(storedWallets) as SolanaWallet[]);
            setEthWallets(JSON.parse(storedEthWallets) as EtheriumWallet[])
        }
    }, [])

    function Mnemonic(): void {
        const newMnemonic = generateMnemonic();
        const newSeed = mnemonicToSeedSync(newMnemonic);
        setMnemonic(newMnemonic);
        setSeed(newSeed);
        setSolWallets([]);
        setEthWallets([]);
        const walletData: WalletData = { mnemonic: newMnemonic, seed: newSeed.toString('hex') };
        localStorage.setItem("walletData", JSON.stringify(walletData));
    }

    function generateSolKey(): void {

        if(!seed) return;

        const solPath = `m/44'/501'/0'/${solWallets.length}'`;
        
        
        const derivedSeed = derivePath(solPath,seed.toString('hex') ).key;
        const keyPair = Keypair.fromSeed(Uint8Array.from(derivedSeed));
        const pubKey = keyPair.publicKey.toBase58();
        const privKey = Buffer.from(keyPair.secretKey).toString('hex');

        const newWallet: SolanaWallet = {
            index: solWallets.length,
            publicKey: pubKey,
            privateKey: privKey
        }

        const updatedWallets = [...solWallets, newWallet];
        setSolWallets(updatedWallets);
        localStorage.setItem("solWallets", JSON.stringify(updatedWallets));
    }

    function generateEthKey(){
        if(!seed) return;

        
        
        const ethPath =  `m/44'/60'/${ethWallets.length}'/0`;

        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(ethPath);
        const hashedPubKey = ethers.computeAddress(child.publicKey);
        const privateKey = child.privateKey;
      

        const newEthWallet : EtheriumWallet = {
            index : ethWallets.length,
            publicKey : hashedPubKey,
            privateKey : privateKey
        }

        const updatedEthWallets = [...ethWallets,newEthWallet];
        setEthWallets(updatedEthWallets);
        localStorage.setItem("ethWallets",JSON.stringify(updatedEthWallets));

    }
   
 

    return (
        <div className="p-4 space-y-4">
            <div className="mt-5 space-y-4 flex flex-col">
                <h1>Create your phrase:</h1>
                <Button className="mb-4 text-sm" onClick={Mnemonic}>Generate Phrase</Button>
                {mnemonic}
            </div>
            <div className="flex space-x-3">
            <Button 
            onClick={generateSolKey}

            >Add Sol wallet</Button>
            <Button 
            onClick={generateEthKey}
            
            >Add Eth wallet</Button>
            <DialogComponent/>
            </div>
            
            <SolWallets wallets={solWallets} />
            <EthWallet wallets={ethWallets}/>
        </div>
    )
}













function SolWallets({ wallets }: SolWalletsProps): JSX.Element {
    return (
        <div>
            <h2>Solana Wallets:</h2>
            {wallets.map((wallet, index) => (
                <div key={index}>
                    <p>Wallet {wallet.index + 1}</p>
                    <Link href={`/wallet/${wallet.publicKey}`}>Public Key: {wallet.publicKey}</Link>
                    {/* <p>Private Key: {wallet.privateKey}</p> */}
                </div>
            ))}
        </div>
    )
}


function EthWallet({wallets} : EthWalletProps){
    return(
        <div>
            <h2>Etherium wallets: </h2>
            {wallets.map((wallet,index) =>(
                <div key={index}>
                    <p>Wallet {wallet.index + 1}</p>
                    <Link href={`/wallet/${wallet.publicKey}`}>Public key : {wallet.publicKey}</Link>
                </div>
            ))}
        </div>
    )
}










