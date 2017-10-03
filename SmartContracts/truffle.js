module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      from: "0x43f8f2ae2b957130cda01dea5f8db16a6c5949a0",
      network_id: 4,
      gas: 4612388
    }
  }
};
