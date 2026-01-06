
// Mock IPFS storage using LocalStorage + SHA-256
export async function uploadToStorage(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Save to localStorage (persists in browser)
    // In a real app, this would be IPFS.add(content)
    if (typeof window !== 'undefined') {
        localStorage.setItem(hashHex, content);
    }
    
    return hashHex;
}

export async function fetchFromStorage(hash: string): Promise<string | null> {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(hash);
    }
    return null;
}
