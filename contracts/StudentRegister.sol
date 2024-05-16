// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract StudentRegister {
    address public owner;
    mapping(address => Student) students;

    struct Student {
        address id;
        string name;
        uint mark1;
        uint mark2;
        uint totalMarks;
        uint percentage;
        bool exists;
    }

    constructor() public {
        owner=msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function register(address id, string memory name, uint mark1, uint mark2) public onlyOwner {
        require(students[id].exists == false, "No es posible realizar fraude, los detalles de este alumno ya han sido registrados y no pueden ser alterados...");

        uint totalMarks = mark1 + mark2;
        uint percentage = (totalMarks* 100) / 200;

        students[id] = Student(id, name, mark1, mark2, totalMarks, percentage, true);
    }

    function getDetails(address id) public view returns (address, string memory, uint, uint) {
        require(students[id].exists, "Student does not exist");
        return (students[id].id, students[id].name, students[id].totalMarks, students[id].percentage);
    }
}