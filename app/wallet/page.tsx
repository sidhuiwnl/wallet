'use client'

import Navbar from "@/components/Navbar"
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import DialogComponent from "@/components/WalletTransaction";
import Link from "next/link";


interface WalletData {
    mnemonic: string;
    seed: string;
}

interface SolanaWallet {
    index: number;
    publicKey: string;
    privateKey: string;
}

export default function Wallet(): JSX.Element {
    return (
        <>
            <Navbar />
            <Generate />
        </>
    )
}

function Generate(): JSX.Element {
    const [mnemonic, setMnemonic] = useState<string>("");
    const [seed, setSeed] = useState<string>("");
    const [solWallets, setSolWallets] = useState<SolanaWallet[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem("walletData");
        if (storedData) {
            const { mnemonic, seed } = JSON.parse(storedData) as WalletData;
            setMnemonic(mnemonic);
            setSeed(seed);
        }

        const storedWallets = localStorage.getItem("solWallets");
        if (storedWallets) {
            setSolWallets(JSON.parse(storedWallets) as SolanaWallet[]);
        }
    }, [])

    function Mnemonic(): void {
        const newMnemonic = generateMnemonic();
        const newSeed = mnemonicToSeedSync(newMnemonic).toString('hex');
        setMnemonic(newMnemonic);
        setSeed(newSeed);
        setSolWallets([]);
        const walletData: WalletData = { mnemonic: newMnemonic, seed: newSeed };
        localStorage.setItem("walletData", JSON.stringify(walletData));
    }

    function generateSolKey(): void {
        const solPath = `m/44'/501'/0'/${solWallets.length}'`;
        const derivedSeed = derivePath(solPath, seed).key;
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


    return (
        <div className="p-4 space-y-4">
            <div className="mt-5 space-y-4 flex flex-col">
                <h1>Create your phrase:</h1>
                <Button className="mb-4 text-sm" onClick={Mnemonic}>Generate Phrase</Button>
                {mnemonic}
            </div>
            <div className="flex space-x-3">
            <Button onClick={generateSolKey}>Add Sol wallet</Button>
            <DialogComponent/>
            </div>
            
            <SolWallets wallets={solWallets} />
        </div>
    )
}


interface SolWalletsProps {
    wallets: SolanaWallet[];
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










