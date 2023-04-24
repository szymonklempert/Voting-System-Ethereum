const { expect } = require("chai");

describe("Create contract", function () {
  let Create, create, owner, addr1, addr2;

  beforeEach(async function () {
    Create = await ethers.getContractFactory("Create");
    [owner, addr1, addr2] = await ethers.getSigners();
    create = await Create.connect(owner).deploy();
  });

  describe("Candidate functions", function () {
    it("Should set candidate", async function () {
      await create.setCandidate(addr1.address, "30", "John", "image", "ipfs");
      const candidateData = await create.getCandidateData(addr1.address);
      expect(candidateData[0]).to.equal("30");
      expect(candidateData[1]).to.equal("John");
      expect(candidateData[2]).to.equal(1);
      expect(candidateData[3]).to.equal("image");
      expect(candidateData[4]).to.equal(0);
      expect(candidateData[5]).to.equal("ipfs");
      expect(candidateData[6]).to.equal(addr1.address);
    });

    it("Should get candidate list", async function () {
      await create.setCandidate(addr1.address, "30", "John", "image", "ipfs");
      await create.setCandidate(addr2.address, "40", "Jane", "image", "ipfs");
      const candidateList = await create.getCandidate();
      expect(candidateList).to.have.lengthOf(2);
      expect(candidateList[0]).to.equal(addr1.address);
      expect(candidateList[1]).to.equal(addr2.address);
    });

    it("Should get candidate length", async function () {
      await create.setCandidate(addr1.address, "30", "John", "image", "ipfs");
      await create.setCandidate(addr2.address, "40", "Jane", "image", "ipfs");
      const candidateLength = await create.getCandidateLength();
      expect(candidateLength).to.equal(2);
    });
  });

  describe("Voter functions", function () {
    it("Should set voter", async function () {
      await create.voterRight(addr1.address, "John", "image", "ipfs");
      const voterData = await create.getVoterData(addr1.address);
      expect(voterData[0]).to.equal(1);
      expect(voterData[1]).to.equal("John");
      expect(voterData[2]).to.equal("image");
      expect(voterData[3]).to.equal(addr1.address);
      expect(voterData[4]).to.equal("ipfs");
      expect(voterData[5]).to.equal(1);
      expect(voterData[6]).to.equal(false);
    });

    it("Should allow vote", async function () {
      await create.voterRight(addr1.address, "John", "image", "ipfs");
      await create.setCandidate(addr2.address, "40", "Jane", "image", "ipfs");
      const signer = await ethers.provider.getSigner(addr1.address);
      const createWithSigner = create.connect(signer);
      await createWithSigner.vote(addr2.address, 1, { from: addr1.address }); // add sender address as a parameter
      const voterData = await create.getVoterData(addr1.address);
      expect(voterData[5]).to.equal(1);
      expect(voterData[6]).to.equal(true);
      const candidateData = await create.getCandidateData(addr2.address);
      expect(candidateData[4]).to.equal(1);
    });

    it("Should get voter length", async function () {
      await create.voterRight(addr1.address, "John", "image", "ipfs");
      await create.voterRight(addr2.address, "Jack", "image", "ipfs");
      const voterLength = await create.getVoterLength();
      expect(voterLength).to.equal(2);
    });
  });
});
