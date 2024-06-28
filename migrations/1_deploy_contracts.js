const CarRental = artifacts.require("CarRental");

module.exports = async function(deployer) {
  await deployer.deploy(CarRental)
};
