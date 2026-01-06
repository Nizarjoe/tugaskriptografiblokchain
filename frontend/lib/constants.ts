export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Hardhat default 0

export const CONTRACT_ABI = [
  "function publishArticle(string title, string contentHash) public",
  "function getAllArticles() public view returns (tuple(uint256 id, string title, string contentHash, address author, uint256 timestamp)[])",
  "event ArticlePublished(uint256 indexed id, string title, string contentHash, address indexed author, uint256 timestamp)"
];
