const hre = require("hardhat");

async function main() {
  const ArticleRegistry = await hre.ethers.getContractFactory("ArticleRegistry");
  const articleRegistry = await ArticleRegistry.deploy();

  await articleRegistry.waitForDeployment();

  console.log("ArticleRegistry deployed to:", await articleRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
