module.exports = {
  networks: {
    development: {
      // Desktop ganache
      // host: "172.31.64.1",
      // Laptop ganache
      host: "192.168.1.37",
      port: 7545,
      network_id: "5777"
    }
  },
  compilers: {
    solc: {
      version: "0.8.19"
    }
  }
};