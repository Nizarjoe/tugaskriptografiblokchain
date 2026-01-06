"use client";
import { useState } from 'react';
import { ethers } from 'ethers';
import { uploadToStorage } from '../../lib/storage';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../lib/constants';

export default function PublishPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Hashing content...');

    try {
      if (!title || !content) throw new Error("Title and content required");

      // 1. Upload to Storage (Off-chain)
      const hash = await uploadToStorage(content);
      setStatus(`Content hashed: ${hash.substring(0, 10)}... Uploading to Blockchain...`);

      // 2. Publish to Blockchain
      if (typeof window.ethereum === 'undefined') throw new Error("MetaMask not found");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.publishArticle(title, hash);
      setStatus('Transaction sent. Waiting for confirmation...');
      
      await tx.wait();
      setStatus('Article Published Successfully! redirecting...');
      
      setTimeout(() => window.location.href = '/', 2000);

    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8 border-b-2 border-stone-300 pb-2">Submit Report</h1>
      
      <form onSubmit={publish} className="space-y-6">
        <div>
          <label className="block font-bold text-sm uppercase tracking-wide mb-1">Headline</label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border-2 border-stone-300 p-3 font-serif text-xl focus:border-black outline-none"
            placeholder="Enter a descriptive headline..."
          />
        </div>
        
        <div>
          <label className="block font-bold text-sm uppercase tracking-wide mb-1">Body Text (Markdown)</label>
          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border-2 border-stone-300 p-3 font-serif h-64 focus:border-black outline-none resize-y"
            placeholder="Write your article content here..."
          />
        </div>

        <div className="bg-stone-100 p-4 text-xs text-stone-600 border border-stone-200">
          <p className="font-bold">PUBLICATION DISCLAIMER</p>
          <p>By publishing, you acknowledge that the content hash will be permanently recorded on the blockchain. Ensure all information is verified and accurate. Illegal content or incitement to violence is strictly prohibited.</p>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-black text-white font-bold uppercase py-4 hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Sign & Publish to Blockchain"}
        </button>
        
        {status && <p className="text-center font-bold mt-4 animate-pulse">{status}</p>}
      </form>
    </div>
  );
}
