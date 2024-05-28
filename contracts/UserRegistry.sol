// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract UserRegistry {

    struct User {
        string name;
        string dni;
        address wallet;
    }

    mapping(string => User) private users;
    // mapping(address => bool) private addressUsed;

    function registerUser(string memory _name, string memory _dni) public {
        // require(!addressUsed[msg.sender], "Address already used");
        require(bytes(users[_dni].dni).length == 0, "User already registered");

        users[_dni] = User({
            name: _name, 
            dni: _dni,
            wallet: msg.sender
        });

        // addressUsed[msg.sender] = true;
    }

    function getUser(string memory _dni) public view returns (string memory, string memory, address) {
        User memory user = users[_dni];

        require(bytes(user.dni).length != 0, "User not registered");

        return (user.name, user.dni, user.wallet);
    }

}