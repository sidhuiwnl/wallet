"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Wallet() {
  const pathname = usePathname();
  const [balance, setBalance] = useState<number | null>(null);
  const [signature, setSignature] = useState<string[]>([]);

  useEffect(() => {
    const publicKey = pathname.replace("/wallet/", "");
    if (publicKey) {
      updateBalance(publicKey);
    }
  }, [pathname]);

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  async function updateBalance(pubKey: string) {
    try {
      const balance = await connection.getBalance(new PublicKey(pubKey));
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
    }
  }

  async function getAirDrop() {
    const publicKey = pathname.replace("/wallet/", "");

    if (!publicKey) {
      console.error("Please select a wallet first or provide a public key");
      return;
    }

    try {
      const pubKey = new PublicKey(publicKey);
      const signature = await connection.requestAirdrop(
        pubKey,
        1 * LAMPORTS_PER_SOL
      );
      setSignature((prev) => [...prev, signature]);
      await updateBalance(publicKey);
    } catch (error) {
      console.error("Airdrop error:", error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Your Wallet</h1>
          <span>Balance: {balance !== null ? `${balance} SOL` : "0 SOL"}</span>
        </div>
        <Button onClick={getAirDrop}>Request Airdrop</Button>
        <p>{signature}</p>
      </div>
    </>
  );
}
