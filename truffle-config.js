module.exports = {
    networks: {
        development: { // Ganache
            host: "localhost",
            port: 8545,
            network_id: "*"
        },
        net42: {
            host: "localhost",
            port: 8545,
            network_id: 42,
            gas: 500000
        },
        ropsten: {
            host: "127.0.0.1",
            port: 8545,
            network_id: 3
        }
    }
};
