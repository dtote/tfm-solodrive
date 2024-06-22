// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract CarRegistry {

    struct Car {
        string model;
        string plate;
        uint32 autonomy;
        uint256 price;
        uint256 dailyCharge;
        bool available;
        address owner;
    }

    mapping(string => Car) private cars;
    mapping(address => string[]) private ownerCarPlates;
    string[] private allCarPlates;

    function registerCar(string memory _model, string memory _plate,  uint32 _autonomy, uint256 _price, uint256 _dailyCharge) public {
        require(bytes(cars[_plate].plate).length == 0, "Car already registered");

        cars[_plate] = Car({
            model: _model, 
            plate: _plate,
            autonomy: _autonomy,
            price: _price,
            dailyCharge: _dailyCharge,
            available: true,
            owner: msg.sender
        });
        allCarPlates.push(_plate);
        ownerCarPlates[msg.sender].push(_plate);
    }

    function toggleCarAvailability(string memory _plate) public {
        Car storage car = cars[_plate];
        require(bytes(car.plate).length != 0, "Car must be registered to toggle availability.");
        car.available = !car.available;
    }

    function getCar(string memory _plate) public view returns (string memory, string memory, uint32, uint256, uint256, bool, address) {
        Car memory car = cars[_plate];

        require(bytes(car.plate).length != 0, "Car not registered");

        // El único que puede ver un coche cuando no está disponible es el dueño
        if (car.owner != msg.sender && !car.available) {
            revert("Car not available");
        }

        return (car.model, car.plate, car.autonomy, car.price, car.dailyCharge, car.available, car.owner);
    }
    
    function isCarRegistered(string memory _plate) public view returns (bool) {
        return cars[_plate].owner != address(0);
    }

    function getAvailableCarPlates() public view returns (string[] memory) {
        string[] memory availablePlates = new string[](allCarPlates.length);
        uint counter = 0;

        // Filtramos las matriculas de los coches que están disponibles
        for (uint i = 0; i < allCarPlates.length; i++) {
            if (cars[allCarPlates[i]].available) {
                availablePlates[counter] = allCarPlates[i];
                counter++;
            }
        }

        // Redimensionamos el array de resultados
        string[] memory filteredPlates = new string[](counter);
        for (uint i = 0; i < counter; i++) {
            filteredPlates[i] = availablePlates[i];
        }

        return filteredPlates;
    }

    function getOwnerCarPlates(address _owner) public view returns (string[] memory) {
        return ownerCarPlates[_owner];
    }
}
