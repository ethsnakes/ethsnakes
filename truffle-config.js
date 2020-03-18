// put  your mnemonic here
const mnemonic = "MNEMONIC_HERE";
const infura =  "INFURA_PROJECT_HERE";

let HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
    networks: {
        test: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        },
        dev: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + infura)
            },
            network_id: 3,
            gas: 4000000
        }
    },
    compilers: {
        solc: {
          version: "0.4.25"
        }
      }
};
