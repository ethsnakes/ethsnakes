const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");
const SnakesAndLaddersMock = artifacts.require("SnakesAndLaddersMock.sol");

module.exports = function(deployer) {
    if (deployer.network === "test") {
        deployer.deploy(SnakesAndLaddersMock);
    } else {
        deployer.deploy(SnakesAndLadders);
    }
};
