const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");
const SnakesAndLaddersMock = artifacts.require("SnakesAndLaddersMock.sol");

const payout1 = "0x0000000000000000000000000000000000000000";
const payout2 = "0x0000000000000000000000000000000000000000";

module.exports = function(deployer, networks, accounts) {
    if (deployer.network === "test" || deployer.network === "dev") {
        deployer.deploy(SnakesAndLaddersMock, accounts[1], accounts[2]);
    } else if (deployer.network === "ropsten") {
        deployer.deploy(SnakesAndLadders, payout1, payout2);
    } else {
        deployer.deploy(SnakesAndLadders, payout1, payout2);
    }
};
