// const { ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const {
  developmentChains,
  networkConfig,
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESC,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const { moveTime } = require("../utils/move-time")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("governor flow", function () {
      let governor, governanceToken, timeLock, box
      let voteWay = 1,
        reason = "I agree to the proposal"

      beforeEach(async () => {
        await deployments.fixture(["all"])

        governor = await ethers.getContract("GovernorContract")

        console.log("governor.functions", governor.functions)

        timeLock = await ethers.getContract("TimeLock")
        box = await ethers.getContract("Box")
        governanceToken = await ethers.getContract("GovernanceToken")

        const boxAddress = box.address
        const timeLockAddress = timeLock.address
        const governanceTokenAddress = governanceToken.address
      })

      it("it can change value only by governance  ", async () => {
        const error = `Ownable: caller is not the owner`
        await expect(box.store(NEW_STORE_VALUE)).to.be.revertedWith(error)
      })

      it("it proposes,votes,queues and then executes...  ", async () => {
        // propose

        let encodedFunctionData = box.interface.encodeFunctionData(FUNC, [
          NEW_STORE_VALUE,
        ])

        let targets = [box.address]
        let values = [0]
        let calldatas = [encodedFunctionData]
        let description = PROPOSAL_DESC

        console.log("proposing....")
        const proposeTxResponse = await governor.propose(
          targets,
          values,
          calldatas,
          description
        )

        await moveBlocks(VOTING_DELAY + 1)

        const proposeTxReceipt = await proposeTxResponse.wait(1)
        const proposalId = proposeTxReceipt.events[0].args.proposalId
        console.log("proposalId", proposalId.toString())

        let proposalState = await governor.state(proposalId)
        console.log("proposalState", proposalState)

        assert.equal(proposalState, 1)

        // vote
        console.log("voting....")
        const voteTxResponse = await governor.castVoteWithReason(
          proposalId,
          voteWay,
          reason
        )
        const voteTxReceipt = await voteTxResponse.wait(1)

        proposalState = await governor.state(proposalId)
        console.log("proposalState", proposalState)

        await moveBlocks(VOTING_PERIOD + 1)

        //  queue

        let descriptionHash = ethers.utils.id(PROPOSAL_DESC)
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

        
        //  execute
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
      
      



      })
    })
