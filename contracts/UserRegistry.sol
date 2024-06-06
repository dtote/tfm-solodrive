// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract UserRegistry {

    struct User {
        string username;
        string dni;
        address wallet;
    }

    mapping(string => User) private users;
    mapping(string => bool) private registeredDNIs;

    function registerUser(string memory _username, string memory _dni) public {
        require(bytes(users[_dni].dni).length == 0, "User already registered");

        users[_dni] = User({
            username: _username, 
            dni: _dni,
            wallet: msg.sender
        });
        registeredDNIs[_dni] = true;
    }

    function getUser(string memory _dni) public view returns (string memory, string memory, address) {
        User memory user = users[_dni];

        require(bytes(user.dni).length != 0, "User not registered");

        return (user.username, user.dni, user.wallet);
    }

    function isUserRegistered(string memory _dni) public view returns (bool) {
        return registeredDNIs[_dni];
    }

}