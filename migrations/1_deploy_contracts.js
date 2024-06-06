const UserRegistry = artifacts.require("UserRegistry");
const CarRegistry = artifacts.require("CarRegistry");

module.exports = function(deployer) {
  deployer.deploy(UserRegistry)
  deployer.deploy(CarRegistry)
};
