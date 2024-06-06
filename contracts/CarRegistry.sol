// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract CarRegistry {

    struct Car {
        string model;
        string plate;
        uint32 autonomy;
        uint256 price;
        bool available;
        address owner;
    }

    mapping(string => Car) private cars;
    string[] private allPlates;

    function registerCar(string memory _model, string memory _plate,  uint32 _autonomy, uint256 _price) public {
        require(bytes(cars[_plate].plate).length == 0, "Car already registered");

        cars[_plate] = Car({
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
        Car memory car = cars[_plate];

        require(bytes(car.plate).length != 0, "Car not registered");

        // El único que puede ver un coche cuando no está disponible es el dueño
        if (car.owner != msg.sender && !car.available) {
            revert("Car not available");
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
