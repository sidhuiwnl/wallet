'use client'

import { generateMnemonic, mnemonicToSeed } from "bip39";
import { Button } from "@/components/ui/button";
import { derivePath } from "ed25519-hd-key";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Keypair } from "@solana/web3.js";

const mnemonic = generateMnemonic();

export default function Wallet() {
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [seed, setSeed] = useState<Buffer | null>(null);
    const [wallets, setWallets] = useState<number[]>([0]);
    
    useEffect(() => {
        async function generateSeed() {
            if (!seed) {
                const newSeed = await mnemonicToSeed(mnemonic);
                setSeed(newSeed);
            }
        }
        generateSeed();
    }, [seed]);

    function handleButtonClick() {
        setShowMnemonic(true);
        setWallets(prevWallets => [...prevWallets, prevWallets.length]);
    }
   
    return (
        <div className="w-screen h-screen">
            <div className="text-center">
                <Button onClick={handleButtonClick}>Generate Wallet</Button>
            </div>
            <div className="mt-5 w-[4xl]">
                {showMnemonic && (
                    <>
                        <Mnemonic mnemonicValue={mnemonic} />
                        {seed && wallets.map((walletIndex) => (
                            <Vault key={walletIndex} seed={seed} walletIndex={walletIndex} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

function Vault({ seed, walletIndex }: { seed: Buffer, walletIndex: number }) {
    const path = `m/44'/501'/${walletIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(Uint8Array.from(derivedSeed));
    const pubKey = keypair.publicKey.toBase58();
    const privKey = Buffer.from(keypair.secretKey).toString('hex');

    return (
        <div>
            <h1>Wallet {walletIndex + 1}:</h1>
            <h2>Public key</h2>
            {pubKey}
            <h2>Private key</h2>
            {privKey}
        </div>
    );
}

function Mnemonic({ mnemonicValue }: { mnemonicValue: string }) {
    return (
        <Card>
            <CardContent className="space-y-3">
                <h1>Current Secret</h1>
                {mnemonicValue}
            </CardContent>
        </Card>
    );
}