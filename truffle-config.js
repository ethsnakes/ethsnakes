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
            host: "127.0.0.1",
            port: 8545,
            network_id: 3
        }
    },
    compilers: {
        solc: {
          version: "0.5.0"
        }
      }
};
