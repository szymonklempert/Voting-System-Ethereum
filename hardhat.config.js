require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // ganache: {
    //   url: "http://localhost:7545",
    //   chainId: 1337, // Replace with your desired chain ID
    // },
    hardhat: {
      chainId: 1337,
    },
  },
};
