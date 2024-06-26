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
        require(bytes(car.plate).length != 0, "Car not registered");
        car.available = !car.available;
    }

    function getCar(string memory _plate) public view returns (string memory, string memory, uint32, uint256, uint256, bool, address) {
        Car memory car = cars[_plate];

        require(bytes(car.plate).length != 0, "Car not registered");

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

    function getOwnerCarPlates() public view returns (string[] memory) {
        return ownerCarPlates[msg.sender];
    }

    function deleteCar(string memory _plate) public {
        // Comprobamos que exista y que esta disponible
        require(cars[_plate].available, "Car is not available or does not exist");
        // Comprobamos que quien trata de borrar el coche, es el propietario
        require(cars[_plate].owner == msg.sender, "You are not the owner of this car");

        // Lo eliminamos de la lista de matriculas del propietario
        string[] storage ownerPlates = ownerCarPlates[msg.sender];
        for (uint256 i = 0; i < ownerPlates.length; i++) {
            if (keccak256(abi.encodePacked(ownerPlates[i])) == keccak256(abi.encodePacked(_plate))) {
                ownerPlates[i] = ownerPlates[ownerPlates.length - 1];
                ownerPlates.pop();
                break;
            }
        }

        // Lo eliminamos de la lista de todas las matriculas
        for (uint256 i = 0; i < allCarPlates.length; i++) {
            if (keccak256(abi.encodePacked(allCarPlates[i])) == keccak256(abi.encodePacked(_plate))) {
                allCarPlates[i] = allCarPlates[allCarPlates.length - 1];
                allCarPlates.pop();
                break;
            }
        }

        // Eliminamos los datos del coche
        delete cars[_plate];
    }
}
