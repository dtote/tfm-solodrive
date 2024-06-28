// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract CarRental {

    struct Rental {
        string plate;
        uint price;
        string contactPhone;
        address client;
        address owner;
        bool active;
    }

    mapping(string => Rental) private activeRentals;
    string[] private activePlates;
    Rental[] private rentalHistory;

    modifier onlyClient(string memory _plate) {
        require(activeRentals[_plate].client == msg.sender, "You are not the client of this rental");
        _;
    }

    function rentCar(string memory _plate, uint _price, string memory _contactPhone, address _owner) public payable {
        require(activeRentals[_plate].client == address(0), "Car is already rented");

        Rental memory newRental = Rental({
            plate: _plate,
            price: _price,
            contactPhone: _contactPhone,
            client: msg.sender,
            owner: _owner,
            active: true
        });

        activeRentals[_plate] = newRental;
        activePlates.push(_plate);
        rentalHistory.push(newRental);

        // Transferimos pago al propietario
        payable(_owner).transfer(msg.value);
    }

    function returnCar(string memory _plate) public onlyClient(_plate) {
        Rental storage rental = activeRentals[_plate];
        require(rental.active, "Car is not currently rented");

        rentalHistory.push(Rental({
            plate: rental.plate,
            price: rental.price,
            contactPhone: rental.contactPhone,
            client: rental.client,
            owner: rental.owner,
            active: false
        }));

        // Eliminamos la matrícula del array de matrículas activas
        for (uint i = 0; i < activePlates.length; i++) {
            if (keccak256(abi.encodePacked(activePlates[i])) == keccak256(abi.encodePacked(_plate))) {
                activePlates[i] = activePlates[activePlates.length - 1];
                activePlates.pop();
                break;
            }
        }

        // Eliminamos la renta (por lo que no hace falta actualizar su estado)
        delete activeRentals[_plate];
    }

    function getActiveRentalsByClient(address _client) public view returns (Rental[] memory) {
        uint count = 0;
        // Contamos la cantidad de rentas activas del cliente
        for (uint i = 0; i < activePlates.length; i++) {
            if (activeRentals[activePlates[i]].client == _client) {
                count++;
            }
        }

        Rental[] memory activeRentalsByClient = new Rental[](count);
        uint index = 0;
        // LLenamos el array con las rentas activas del cliente
        for (uint i = 0; i < activePlates.length; i++) {
            if (activeRentals[activePlates[i]].client == _client) {
                activeRentalsByClient[index] = activeRentals[activePlates[i]];
                index++;
            }
        }

        return activeRentalsByClient;
    }
}
