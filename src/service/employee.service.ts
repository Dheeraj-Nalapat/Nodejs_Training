import Address from "../entity/address.entity";
import { Employee } from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  getAllEmployee = async () => {
    return this.employeeRepository.find();
  };

  getEmployeeById = async (id: number) => {
    return this.employeeRepository.findOneBy({ id });
  };

  createEmployee = async (
    name: string,
    email: string,
    age: number,
    address: any
  ) => {
    const newEmployee = new Employee();
    newEmployee.name = name;
    newEmployee.email = email;
    newEmployee.age = age;
    const newAddress = new Address();
    newAddress.line1 = address.line1;
    newAddress.pincode = address.pincode;
    newEmployee.address = newAddress;
    return this.employeeRepository.save(newEmployee);
  };

  //updateEmployeeById = async (id: number,)

  deleteEmployee = async (id: number) => {
    return this.employeeRepository.softRemove(id);
  };
}

export default EmployeeService;
