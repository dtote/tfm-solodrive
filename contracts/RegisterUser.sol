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

    function registerUser(string calldata _dni, string calldata _name) external {
        require(bytes(users[_dni].dni).length == 0, "User already registered.");
        users[_dni] = User(_dni, _name);
        emit UserRegistered(_dni, _name);
    }

    function getUser(string calldata _dni) external view returns (User memory) {
        require(bytes(users[_dni].dni).length != 0, "User not found.");
        return users[_dni];
    }
}
