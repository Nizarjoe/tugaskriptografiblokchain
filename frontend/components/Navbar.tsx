"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Navbar() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User denied account access", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
       window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) setAccount(accounts[0]);
        });
    }
  }, []);

  return (
    <nav className="border-b-4 border-black py-4 bg-white">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-baseline space-x-2">
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase font-serif">Civic Ledger</Link>
            <span className="text-xs font-bold bg-black text-white px-1">LOCAL</span>
        </div>
        <div className="flex items-center space-x-6 font-bold font-sans text-sm">
          <Link href="/" className="hover:underline">LATEST STORIES</Link>
          <Link href="/publish" className="hover:underline text-red-700">PUBLISH ARTICLE</Link>
          <button 
            onClick={connect}
            className="border-2 border-black px-4 py-1 hover:bg-black hover:text-white transition-colors"
          >
            {account ? `${account.substring(0,6)}...${account.substring(38)}` : "CONNECT WALLET"}
          </button>
        </div>
      </div>
    </nav>
  );
}
