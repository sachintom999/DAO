// const { getNamedAccounts, deployments, network, run } = require("hardhat")
const { network, run, ethers } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
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
  const governanceToken = await ethers.getContract("GovernanceToken")
  const timelock = await ethers.getContract("TimeLock")

  const arguments = [
    governanceToken.address,
    timelock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ]
  // deploy contract
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  log("----------------------------------------------------")
}

module.exports.tags = ["all", "governorContract"]
