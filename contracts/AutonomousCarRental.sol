// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AutonomousCarManager.sol";

contract AutonomousCarRental {
    AutonomousCarManager public autonomousCarManager;

    struct Rental {
        address renter;
        uint256 rentalStart;
        uint256 rentalEnd;
    }

    mapping(uint => Rental) public rentals;

    event CarRented(uint id, address renter, uint256 rentalStart, uint256 rentalEnd);
    event CarReturned(uint id);

    constructor(address _autonomousCarManagerAddress) {
        autonomousCarManager = AutonomousCarManager(_autonomousCarManagerAddress);
    }

    function rentCar(uint _id) external {
        (
            , 
            , 
            , 
            , 
            , 
            , 
            bool isAvailable, 
            , 
            uint256 rentalEnd, 
            
        ) = autonomousCarManager.getAutonomousCar(_id);
        require(isAvailable, "El coche no esta disponible en este momento.");
        require(block.timestamp >= rentalEnd, "El coche ya esta alquilado.");

        uint256 rentalStart = block.timestamp;
        rentalEnd = rentalStart + 86400; // 1 día de alquiler

        rentals[_id] = Rental({
            renter: msg.sender,
            rentalStart: rentalStart,
            rentalEnd: rentalEnd
        });

        autonomousCarManager.setRentalDetails(_id, msg.sender, rentalStart, rentalEnd);

        emit CarRented(_id, msg.sender, rentalStart, rentalEnd);
    }

    function returnCar(uint _id) external {
        Rental storage rental = rentals[_id];
        require(rental.renter == msg.sender, "No has alquilado este coche.");
        require(block.timestamp >= rental.rentalEnd, "El periodo de alquiler no ha finalizado.");

        delete rentals[_id];

        autonomousCarManager.clearRentalDetails(_id);

        emit CarReturned(_id);
    }

    function getRentalDetails(uint _id) external view returns (address, uint256, uint256) {
        Rental storage rental = rentals[_id];
        return (rental.renter, rental.rentalStart, rental.rentalEnd);
    }
}
