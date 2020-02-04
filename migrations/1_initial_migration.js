const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
    if (deployer.network === "test" || deployer.network === "dev") {
        deployer.deploy(Migrations);
    }
};
