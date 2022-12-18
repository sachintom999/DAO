const fs = require("fs")
const { ethers, network, getChainId } = require("hardhat")
const {
  VOTING_DELAY,
  developmentChains,
  proposalFile,
  FUNC,
  PROPOSAL_DESC,
  NEW_STORE_VALUE,
} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
async function propose(functionToCall, args, proposalDescription) {
  const governor = await ethers.getContract("GovernorContract")
  const box = await ethers.getContract("Box")

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  )

  console.log("encodedFunctionCall", encodedFunctionCall)

  const proposeTxResponse = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }

  const proposeTxReceipt = await proposeTxResponse.wait(1)
  const proposalId = proposeTxReceipt.events[0].args.proposalId
  console.log("proposalId.toString()", proposalId.toString())

  const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)

  await storeProposalId(proposalId)

  console.log("proposalState", proposalState.toString())
  console.log("proposalSnapShot", proposalSnapShot.toString())
  console.log("proposalDeadline", proposalDeadline.toString())
}

async function storeProposalId(proposalId) {
  // const chainId = await getChainId()
  const chainId = (await getChainId()).toString()
  let proposals

  if (fs.existsSync("proposals.json")) {
    proposals = JSON.parse(fs.readFileSync("proposals.json", "utf8"))
  } else {
    proposals = {}
    proposals[chainId] = []
  }
  proposals[chainId].push(proposalId.toString())
  fs.writeFileSync("proposals.json", JSON.stringify(proposals), "utf8")
}



propose(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESC)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
