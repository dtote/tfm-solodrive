// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract RegisterUser {
    struct User {
        string dni;
        string name;
    }

    mapping(string => User) public users;

    event UserRegistered(string dni, string name);

    function registerUser(string calldata dni, string calldata name) external {
        // require(bytes(users[dni].dni).length == 0, "User already registered.");
        users[dni] = User(dni, name);
        // emit UserRegistered(dni, name);
    }

    function getUser(string calldata dni) external view returns (User memory) {
        // require(bytes(users[dni].dni).length != 0, "User not found.");
        return users[dni];
    }
}