const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");
const SnakesAndLaddersMock = artifacts.require("SnakesAndLaddersMock.sol");

module.exports = function(deployer, networks, accounts) {
    if (deployer.network === "test") {
        deployer.deploy(SnakesAndLaddersMock, accounts[1], accounts[2]);
    } else {
        deployer.deploy(SnakesAndLadders, accounts[1], accounts[2]);
    }
};
