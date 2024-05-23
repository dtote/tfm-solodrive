// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AutonomousCarManager {
    struct AutonomousCar {
        uint id;
        address owner;
        string model;
        uint256 rentalPrice;
        uint8 seats;
        uint256 autonomy;
        bool isAvailable;
        address renter;
        uint256 rentalStart;
        uint256 rentalEnd;
    }

    uint public autonomousCarCount = 0;
    mapping(uint => AutonomousCar) public autonomousCars;

    event AutonomousCarAdded(uint id, address owner, string model, uint256 rentalPrice, uint8 seats, uint256 autonomy);
    event AutonomousCarUpdated(uint id, address owner, string model, uint256 rentalPrice, uint8 seats, uint256 autonomy);
    event AutonomousCarAvailabilityChanged(uint id, bool isAvailable);

    function addAutonomousCar(string memory _model, uint256 _rentalPrice, uint8 _seats, uint256 _autonomy) public {
        require(_autonomy > 0, "La autonomia debe ser mayor a 0."); // Verificamos que se trata de un coche autonomo
        autonomousCarCount++;
        autonomousCars[autonomousCarCount] = AutonomousCar({
            id: autonomousCarCount,
            owner: msg.sender,
            model: _model,
            rentalPrice: _rentalPrice,
            seats: _seats,
            autonomy: _autonomy,
            isAvailable: true,
            renter: address(0),
            rentalStart: 0,
            rentalEnd: 0
        });
        emit AutonomousCarAdded(autonomousCarCount, msg.sender, _model, _rentalPrice, _seats, _autonomy);
    }

    function getAutonomousCar(uint _id) public view returns (uint, address, string memory, uint256, uint8, uint256, bool, address, uint256, uint256) {
        AutonomousCar storage car = autonomousCars[_id];
        return (
            car.id, 
            car.owner, 
            car.model, 
            car.rentalPrice, 
            car.seats, 
            car.autonomy, 
            car.isAvailable, 
            car.renter, 
            car.rentalStart, 
            car.rentalEnd
        );
    }

    function updateAutonomousCar(uint _id, string memory _model, uint256 _rentalPrice, uint8 _seats, uint256 _autonomy) public {
        AutonomousCar storage car = autonomousCars[_id];
        require(car.owner == msg.sender, "No tienes permisos para modificar los datos del vehiculo.");

        car.model = _model;
        car.rentalPrice = _rentalPrice;
        car.seats = _seats;
        car.autonomy = _autonomy;

        emit AutonomousCarUpdated(_id, car.owner, car.model, car.rentalPrice, car.seats, car.autonomy);
    }

    function setAvailability(uint _id, bool _isAvailable) external {
        AutonomousCar storage car = autonomousCars[_id];
        require(car.owner == msg.sender, "No tienes permisos para modificar la disponibilidad del vehiculo.");
        
        car.isAvailable = _isAvailable;

        emit AutonomousCarAvailabilityChanged(_id, _isAvailable);
    }

    function setRentalDetails(uint _id, address _renter, uint256 _rentalStart, uint256 _rentalEnd) external {
        AutonomousCar storage car = autonomousCars[_id];
        require(car.isAvailable, "El coche no esta disponible.");

        car.renter = _renter;
        car.rentalStart = _rentalStart;
        car.rentalEnd = _rentalEnd;
        car.isAvailable = false;
    }

    function clearRentalDetails(uint _id) external {
        AutonomousCar storage car = autonomousCars[_id];

        car.renter = address(0);
        car.rentalStart = 0;
        car.rentalEnd = 0;
        car.isAvailable = true;
    }
}
