# Civic Ledger - Web3 Journalism Platform

A decentralized, censorship-resistant journalism platform running locally. 
Stores article hashes on a local blockchain (Hardhat) and content in local storage.

## Features
- **Immutable Registry**: Articles are hashed and stored on-chain.
- **Local Storage**: Content is safely stored locally (simulating IPFS).
- **Verification**: Automatic integrity checks (Green/Red indicators).
- **Civic Tech UI**: Clean, high-contrast journalism aesthetic.

## Prerequisite
- Node.js (v18+)
- MetaMask Extension (configured for Localhost 8545)

## Quick Start

### 1. Start Blockchain (Backend)
Open a new terminal:
```bash
cd backend
npm install
npx hardhat node
```
*Keep this terminal running.*

### 2. Deploy Contract
Open a second terminal:
```bash
cd backend
npx hardhat run scripts/deploy.js --network localhost
```
**Copy the deployed address** (e.g., `0x5FbDB2315678...`).

### 3. Configure Frontend
Update `frontend/lib/constants.ts` with the new address:
```typescript
export const CONTRACT_ADDRESS = "0xYourAddressHere";
```

### 4. Run Website (Frontend)
Open a third terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Usage
1. **Connect Wallet**: Click "Connect Wallet" (use Hardhat Account #0 private key to import into MetaMask).
2. **Publish**: Go to "Publish Article", enter title/content. Sign transaction.
3. **Verify**: Go to Home. Valid articles show "Verified".

## Tech Stack
- Next.js 14 App Router
- Hardhat (Localhost)
- Solidity 0.8.24
- Tailwind CSS
- Ethers.js v6