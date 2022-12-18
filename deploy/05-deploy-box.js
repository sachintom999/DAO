// const { getNamedAccounts, deployments, network, run } = require("hardhat")
const { network, run } = require("hardhat")
const { ethers } = require("hardhat")

const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  // specific to localhost
  if (chainId == 31337) {
    // Fetch mocks of external contracts
  } else {
    // Fetch addresses external contracts from networkConfig
  }

  log("----------------------------------------------------")

  // arguments
  const arguments = []
  // deploy contract
  const box = await deploy("Box", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  

  const timeLock = await ethers.getContract("TimeLock")
  const boxContract = await ethers.getContractAt("Box", box.address)

  const transferOwnershipTxResponse = await boxContract.transferOwnership(
    timeLock.address
  )
  await transferOwnershipTxResponse.wait(1)

  log("Done....")
}


module.exports.tags = ["all", "box"]



