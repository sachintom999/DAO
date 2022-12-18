const MIN_DELAY = 3600

const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
//  const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
const VOTING_PERIOD = 5 // blocks
const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active

const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",
  },
  4: {
    name: "rinkeby",

    vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
  },
  1: {
    name: "mainnet",
  },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const proposalFile = "proposals.json"

const FUNC = "store"
const PROPOSAL_DESC = "First proposal"
const NEW_STORE_VALUE = 77

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  proposalFile,
  FUNC,
  PROPOSAL_DESC,
  NEW_STORE_VALUE,
}
