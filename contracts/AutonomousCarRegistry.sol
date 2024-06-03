// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract AutonomousCarRegistry {

    struct AutonomousCar {
        string model;
        string plate;
        uint32 autonomy;
        uint256 price;
        bool available;
        address owner;
    }

    mapping(string => AutonomousCar) private cars;
    string[] private allPlates;

    function registerCar(string memory _model, string memory _plate,  uint32 _autonomy, uint256 _price) public {
        require(bytes(cars[_plate].plate).length == 0, "Autonomous car already registered");

        cars[_plate] = AutonomousCar({
            model: _model, 
            plate: _plate,
            autonomy: _autonomy,
            price: _price,
            available: true,
            owner: msg.sender
        });
        allPlates.push(_plate);
    }

    function getCar(string memory _plate) public view returns (string memory, string memory, uint32, uint256, bool, address) {
        AutonomousCar memory car = cars[_plate];

        require(bytes(car.plate).length != 0, "Autonomous car not registered");

        // El único que puede ver un coche cuando no está disponible es el dueño
        if (car.owner != msg.sender && !car.available) {
            revert("Autonomous car not available");
        }

        return (car.model, car.plate, car.autonomy, car.price, car.available, car.owner);
    }

    function getAvailableCars() public view returns (string[] memory) {
        string[] memory availablePlates = new string[](allPlates.length);
        uint counter = 0;

        // Filtramos las matriculas de los coches que están disponibles
        for (uint i = 0; i < allPlates.length; i++) {
            if (cars[allPlates[i]].available) {
                availablePlates[counter] = allPlates[i];
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

}
