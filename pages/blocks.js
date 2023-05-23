import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const blocks = () => {
  async function fetchBlocks() {
    const provider = new ethers.providers.JsonRpcProvider();

    const latestBlockNumber = await provider.getBlockNumber();

    const blocks = [];

    for (let i = 0; i <= latestBlockNumber; i++) {
      const block = await provider.getBlockWithTransactions(i);

      const transactions = block.transactions.map((tx) => ({
        from: tx.from,
        to: tx.to,
        hash: tx.hash,
      }));

      blocks.push({
        blockNumber: block.number,
        timestamp: block.timestamp,
        transactions,
      });
    }
    console.log(blocks);
    return blocks;
  }

  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Fetch the blocks when the component mounts
    fetchBlocks().then(setBlocks);
  }, []);
  return (
    <div style={{ color: "white" }}>
      <h2>Blocks</h2>
      <ul>
        {blocks.map((block) => (
          <li key={block.blockNumber}>
            <strong>Block Number:</strong> {block.blockNumber},&nbsp;
            <strong>Timestamp:</strong>{" "}
            {new Date(block.timestamp * 1000).toLocaleString()}
            <ul>
              {block.transactions.map((tx) => (
                <li key={tx.hash}>
                  <strong>From:</strong> {tx.from},&nbsp;
                  <strong>To:</strong> {tx.to ? tx.to : "Contract Creation"}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default blocks;
