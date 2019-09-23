const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");

module.exports = function(deployer) {
  deployer.deploy(SnakesAndLadders);
};
