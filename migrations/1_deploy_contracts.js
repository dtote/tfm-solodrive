const AutonomousCarManager = artifacts.require("AutonomousCarManager");
const AutonomousCarRental = artifacts.require("AutonomousCarRental");

module.exports = async function(deployer) {
  await deployer.deploy(AutonomousCarManager)
  const autonomousCarManager = await AutonomousCarManager.deployed()
  
  await deployer.deploy(AutonomousCarRental, autonomousCarManager.address)
};
