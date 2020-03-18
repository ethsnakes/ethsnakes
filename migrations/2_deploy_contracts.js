const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");

const payout1 = "0x0000000000000000000000000000000000000000";
const payout2 = "0x0000000000000000000000000000000000000000";

module.exports = function(deployer, networks, accounts) {
    deployer.deploy(SnakesAndLadders, payout1, payout2);
};
