// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArticleRegistry {
    struct Article {
        uint256 id;
        string title;
        string contentHash; // IPFS or Local Hash
        address author;
        uint256 timestamp;
    }

    mapping(uint256 => Article) public articles;
    uint256 public articleCount;

    event ArticlePublished(
        uint256 indexed id,
        string title,
        string contentHash,
        address indexed author,
        uint256 timestamp
    );

    function publishArticle(string memory _title, string memory _contentHash) public {
        articleCount++;
        articles[articleCount] = Article(
            articleCount,
            _title,
            _contentHash,
            msg.sender,
            block.timestamp
        );

        emit ArticlePublished(
            articleCount,
            _title,
            _contentHash,
            msg.sender,
            block.timestamp
        );
    }

    function getAllArticles() public view returns (Article[] memory) {
        Article[] memory allArticles = new Article[](articleCount);
        for (uint256 i = 1; i <= articleCount; i++) {
            allArticles[i - 1] = articles[i];
        }
        return allArticles;
    }
}
