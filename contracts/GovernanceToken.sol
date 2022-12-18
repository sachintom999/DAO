// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts

/* Imports*/

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/* Errors */

contract GovernanceToken is ERC20Votes {
    uint public s_maxSupply = 1000000000000000000000000;

    constructor()
        ERC20("GovernanceToken", "GT")
        ERC20Permit("GovernanceToken")
    {
        _mint(msg.sender, s_maxSupply);
    }
}
