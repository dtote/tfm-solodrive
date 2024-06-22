// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

interface ICarRegistry {
    function toggleCarAvailability(string memory _plate) external;
}

contract CarRentalContract {

    struct RentalContract {
        string plate;
        uint price;
        uint pricePerDay;
        uint funds;
        uint charges;
        string phone;
        address owner;
        address client;
    }

    mapping(string => RentalContract) public rentals;
    mapping(address => string[]) private clientRentalCarPlates;
    address public carRegistryAddress;
    
    constructor(address _carRegistryAddress) {
        carRegistryAddress = _carRegistryAddress;
    }

    function createRental(
        string memory _plate,
        uint _price,
        uint _pricePerDay,
        string memory _phone,
        address _owner
    ) public payable {
        require(rentals[_plate].owner == address(0), 'Rental for that car already exists');

        rentals[_plate] = RentalContract({
            plate: _plate,
            price: _price,
            pricePerDay: _pricePerDay,
            funds: 0,
            charges: 0,
            phone: _phone,
            owner: _owner,
            client: msg.sender
        });
        clientRentalCarPlates[msg.sender].push(_plate);

        // Se transfiere el valor recibido al propietario
        payable(_owner).transfer(msg.value);

        // Invocamos la funcion toggleCarAvailability del contrato CarRegistry
        ICarRegistry(carRegistryAddress).toggleCarAvailability(_plate);
    }

    function getRental(string memory _plate) public view returns (string memory, uint, uint, uint, uint, string memory, address, address) {
        RentalContract memory rentalContract = rentals[_plate];

        require(bytes(rentalContract.plate).length != 0, "Rental contract not registered");

        return (rentalContract.plate, rentalContract.price, rentalContract.pricePerDay, rentalContract.funds, rentalContract.charges, rentalContract.phone, rentalContract.owner, rentalContract.client);
    }

    function getClientRentalCarPlates(address _client) public view returns (string[] memory) {
        return clientRentalCarPlates[_client];
    }
}
