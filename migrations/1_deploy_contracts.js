// const AutonomousCarManager = artifacts.require("AutonomousCarManager");
// const AutonomousCarRental = artifacts.require("AutonomousCarRental");
const UserRegistry = artifacts.require("UserRegistry");
const AutonomousCarRegistry = artifacts.require("AutonomousCarRegistry");
module.exports = function(deployer) {
  deployer.deploy(UserRegistry)
  deployer.deploy(AutonomousCarRegistry)
  // await deployer.deploy(AutonomousCarManager)
  // const autonomousCarManager = await AutonomousCarManager.deployed()
  
  // await deployer.deploy(AutonomousCarRental, autonomousCarManager.address)
};
