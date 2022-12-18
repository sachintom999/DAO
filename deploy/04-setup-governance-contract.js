// const { getNamedAccounts, deployments, network, run } = require("hardhat")
const { network, run } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")

const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const timeLock = await ethers.getContract("TimeLock", deployer)
  const GovernorContract = await ethers.getContract(
    "GovernorContract",
    deployer
  )

  log("setting up roles...")

  const proposerRole = await timeLock.PROPOSER_ROLE()
  const executorRole = await timeLock.EXECUTOR_ROLE()
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()
  const proposerTxResponse = await timeLock.grantRole(
    proposerRole,
    GovernorContract.address
  )
  await proposerTxResponse.wait(1)

  const executorTxResponse = await timeLock.grantRole(
    executorRole,
    ethers.constants.AddressZero
  )
  await executorTxResponse.wait(1)

  const revokeTxResponse = await timeLock.revokeRole(adminRole, deployer)
  await revokeTxResponse.wait(1)
}

module.exports.tags = ["all"]
