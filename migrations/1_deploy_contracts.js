const CarRegistry = artifacts.require("CarRegistry");
const CarRentalContract = artifacts.require("CarRentalContract");

module.exports = async function(deployer) {
  const carRegistry = await deployer.deploy(CarRegistry)
  await deployer.deploy(CarRentalContract, carRegistry.address)
};
