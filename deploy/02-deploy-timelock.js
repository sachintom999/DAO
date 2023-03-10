// const { getNamedAccounts, deployments, network, run } = require("hardhat")
const { network, run } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  MIN_DELAY,
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
  const arguments = [MIN_DELAY, [], []]
  // deploy contract
  const timelock = await deploy("TimeLock", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...")
    await verify(timelock.address, arguments)
  }

  log("----------------------------------------------------")
}

module.exports.tags = ["all", "timelock"]
