const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");
const SnakesAndLaddersMock = artifacts.require("SnakesAndLaddersMock.sol");

module.exports = function(deployer, networks, accounts) {
    if (deployer.network === "test" || deployer.network === "dev") {
        deployer.deploy(SnakesAndLaddersMock, accounts[1], accounts[2]);
    } else if (deployer.network === "ropsten") {
        const payout1 = "0x1ac7e395F59c8953C89dD2e70Cefc49D7dFfBdcD";
        const payout2 = "0x6Eea517De685cF6122050CAe4e900Eea36c17374";
        deployer.deploy(SnakesAndLadders, payout1, payout2);
    } else {
        const payout1 = accounts[1];
        const payout2 = accounts[1];
        deployer.deploy(SnakesAndLadders, payout1, payout2);
    }
};
