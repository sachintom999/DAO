const { ethers } = require("hardhat")
const {
  FUNC,
  PROPOSAL_DESC,
  NEW_STORE_VALUE,
  MIN_DELAY,
} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const { moveTime } = require("../utils/move-time")
async function queueAndExecute() {
  const box = await ethers.getContract("Box")
  // console.log('box.functions', box.functions)
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [
    NEW_STORE_VALUE,
  ])

  const targets = [box.address]
  const values = [0]
  const calldatas = [encodedFunctionCall]
  const descriptionHash = ethers.utils.id(PROPOSAL_DESC)
  // ethers.utils.keccak256(
    // ethers.utils.toUtf8Bytes(PROPOSAL_DESC)
    // ethers.utils.id(PROPOSAL_DESC)
  // )
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract")

  console.log('governor.address', governor.address)

  const hashProposalTxResponse = await governor.hashProposal(targets,values,calldatas,descriptionHash)
  // const hashProposalTxReceipt = await hashProposalTxResponse.wait(1)
  console.log('hashProposalTxResponse', hashProposalTxResponse.toString())

  console.log("Queueing...")

  const queueTxResponse = await governor.queue(
    targets,
    values,
    calldatas,
    descriptionHash
  )
  await queueTxResponse.wait(1)

  // move blocks
  await moveTime(MIN_DELAY + 1)
  // move time
  await moveBlocks(1)

  console.log("executing...")

  const executeTxResponse = await governor.execute(
    targets,
    values,
    calldatas,
    descriptionHash
  )
  await executeTxResponse.wait(1)

  console.log("Done..")

  const newValue = await box.retrieve()
  console.log('newValue', newValue.toString())


}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
