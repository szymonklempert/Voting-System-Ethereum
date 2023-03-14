// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

//start
const hre = require("hardhat");

async function main() {
  const Create = await hre.ethers.getContractFactory("Create");
  const create = await Create.deploy();

  await create.deployed();

  console.log(`Lock with 1 Eth deployed to ${create.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// async function main() {
//   // Get the contract factory
//   const MyContract = await ethers.getContractFactory("MyContract");

//   // Deploy the contract using the main account
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying contract with account:", deployer.address);
//   const myContract = await MyContract.deploy();

//   console.log("Contract address:", myContract.address);
// }

// // Call the main function to deploy the contract
// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
