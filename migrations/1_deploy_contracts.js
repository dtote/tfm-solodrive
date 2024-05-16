const RegisterUser = artifacts.require("RegisterUser");
const Registration = artifacts.require("Registration");
const StudentRegister = artifacts.require("StudentRegister");

module.exports = function(deployer) {
  deployer.deploy(RegisterUser)
  deployer.deploy(Registration)
  deployer.deploy(StudentRegister)
};
