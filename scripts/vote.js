const { ethers, getChainId } = require("hardhat")
const fs = require("fs")
const { developmentChains, VOTING_DELAY, VOTING_PERIOD } = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")

async function main() {
  const chainId = await getChainId()
  const proposals = JSON.parse(fs.readFileSync("proposals.json", "utf8"))
  const proposalId = proposals[chainId].at(-1)
  const voteWay = 1
  const reason = "I agree"

  await vote(proposalId, voteWay, reason)
}

const vote = async (proposalId, voteWay, reason) => {
  const governor = await ethers.getContract("GovernorContract")
  
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  )
  await voteTxResponse.wait(1)

  const state = await governor.state(proposalId)
  console.log("state", state)


  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1)
  }


  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  console.log('proposalSnapShot.toString()', proposalSnapShot.toString())
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
