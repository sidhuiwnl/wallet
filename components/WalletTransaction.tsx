'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";

interface Wallet {
    publicKey: string;
    privateKey: string;
  }


export default function DialogComponent() {


    
    const [selectedWallet, setSelectedWallet] = useState("");
    const [amount, setAmount] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");

    function getWallets() : Wallet[]{
        try {
            const walletData = localStorage.getItem("solWallets");
            return walletData ? JSON.parse(walletData) : []
        } catch (error) {
            console.error("Error parsing wallets from localStorage:", error);
            return []
        }
    }

    
    const wallets  : Wallet[] = getWallets();

    async function transaction(){
        if(!selectedWallet || !amount || !recipientAddress){
            alert("Please fill in all fields");
                return;
        }

        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        const wallet = wallets.find(w => w.publicKey ===  selectedWallet);
        if(!wallet){
            alert("Selected wallet not found");
            return;
        }
        try {
            const fromPubkey = new PublicKey(wallet.publicKey);
            const toPubkey = new PublicKey(recipientAddress);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports: LAMPORTS_PER_SOL * parseFloat(amount)
                })
            );

            const privateKeyBytes = wallet.privateKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16));
            
            if(!privateKeyBytes){
                throw new Error("Invalid private key format");
            }
            const signers = [Keypair.fromSecretKey(new Uint8Array(privateKeyBytes))];

            
            const signature = await sendAndConfirmTransaction(
                connection,
                transaction,
                signers
            );
            console.log('Transaction sent:', signature);
            alert(`Transaction successful! Signature: ${signature}`);
        } catch (error) {
            console.error('Error:', error);
            alert(`Transaction failed: ${error}`);
        }
    }



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Send Sol</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>Send Sol</DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="wallet" className="text-right">
                            From Wallet
                        </Label>
                        <Select onValueChange={setSelectedWallet} value={selectedWallet}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select wallet" />
                            </SelectTrigger>
                            <SelectContent>
                                {wallets.map((wallet, index) => (
                                    <SelectItem key={wallet.publicKey} value={wallet.publicKey}>
                                        Wallet {index + 1}: {wallet.publicKey.slice(0, 8)}...
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            To Address
                        </Label>
                        <Input
                            id="address"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter recipient address"
                        />
                    </div>
                </div>
                <Button onClick = { transaction}>Send</Button>
            </DialogContent>
        </Dialog>
    )
}