// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract Registration {
    mapping(address => bool) public registeredUsers;
    uint256 public totalRegisteredUsers;

    constructor() {
        totalRegisteredUsers = 0;
    }

    event UserRegistered(address indexed user);

    function register() public {
        require(!registeredUsers[msg.sender], "Already registered");

        registeredUsers[msg.sender] = true;
        totalRegisteredUsers++;

        emit UserRegistered(msg.sender);
    }

}
