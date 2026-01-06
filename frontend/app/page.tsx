"use client";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { fetchFromStorage } from '../lib/storage';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/constants';

// Integrity Icon Components
const VerifiedIcon = () => (
  <span className="text-green-600 flex items-center space-x-1" title="Content Verified">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span className="text-xs font-bold uppercase">Verified</span>
  </span>
);

const CorruptedIcon = () => (
   <span className="text-red-600 flex items-center space-x-1" title="Content Mismatch">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <span className="text-xs font-bold uppercase">Mismatch</span>
  </span>
);

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    if (typeof window.ethereum === 'undefined') {
       console.log("No wallet found");
       setLoading(false);
       return;
    }

    try {
      // Connect specifically to Localhost for fetching public data
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Fetch all articles
      const data = await contract.getAllArticles();
      
      const processed = await Promise.all(data.map(async (article: any) => {
        // Fetch content locally
        const content = await fetchFromStorage(article.contentHash);
        
        // Verify Hash locally
        let verified = false;
        if (content) {
            const encoder = new TextEncoder();
            const dataBuf = encoder.encode(content);
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuf);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            verified = (hashHex === article.contentHash);
        }

        return {
          id: article.id.toString(),
          title: article.title,
          hash: article.contentHash,
          author: article.author,
          timestamp: new Date(Number(article.timestamp) * 1000).toLocaleDateString(),
          content: content || "Content unavailable locally (IPFS node not running)",
          verified
        };
      }));

      // Sort by newest
      setArticles(processed.reverse());
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-serif text-xl border-dashed border-2 border-stone-300 m-8">Connecting to Civic Record...</div>;

  return (
    <div className="space-y-12">
      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-stone-500 italic">No records found locally.</p>
        </div>
      ) : (
        articles.map((article) => (
          <article key={article.id} className="border-b border-stone-300 pb-8 last:border-0 relative">
             <div className="absolute top-0 right-0">
               {article.verified ? <VerifiedIcon /> : <CorruptedIcon />}
             </div>
             <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
               Record #{article.id} &bull; {article.timestamp} &bull; by {article.author.substring(0,8)}...
             </div>
             <h2 className="text-3xl font-serif font-black mb-4 leading-tight">{article.title}</h2>
             <div className="prose prose-stone max-w-none font-serif text-lg leading-relaxed text-stone-800">
               {article.content}
             </div>
             <div className="mt-4 text-xs font-mono text-stone-400 break-all">
               IMMUTABLE HASH: {article.hash}
             </div>
          </article>
        ))
      )}
    </div>
  );
}
