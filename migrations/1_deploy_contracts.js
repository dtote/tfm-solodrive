// const AutonomousCarManager = artifacts.require("AutonomousCarManager");
// const AutonomousCarRental = artifacts.require("AutonomousCarRental");
const UserRegistry = artifacts.require("UserRegistry");
module.exports = function(deployer) {
  deployer.deploy(UserRegistry)
  // await deployer.deploy(AutonomousCarManager)
  // const autonomousCarManager = await AutonomousCarManager.deployed()
  
  // await deployer.deploy(AutonomousCarRental, autonomousCarManager.address)
};
