import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpdateEmployeeDto } from "../dto/employee.dto";
import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";
import { Role } from "../utils/role.enum";
import bcrypt from "bcrypt";
import { error } from "console";
import IncorrectPasswordException from "../exceptions/incorrectPassword.exception";
import EntityNotFoundException from "../exceptions/entityNotFound.exception";
import { jwtPayload } from "../utils/jwtPayload";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import jsonwebtoken from "jsonwebtoken";
import { CustomError, ErrorCodes } from "../utils/error.code";
import { CreateAddressDto, UpdateAddressDto } from "../dto/address.dto";
import { CreateDepartmentDto } from "../dto/department.dto";

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
    password: string,
    role: Role,
    address: CreateAddressDto
  ) => {
    const newEmployee = new Employee();
    newEmployee.name = name;
    newEmployee.email = email;
    newEmployee.age = age;
    newEmployee.password = password ? await bcrypt.hash(password, 10) : "";
    newEmployee.role = role;
    const newAddress = new Address();
    newAddress.line1 = address.line1;
    newAddress.pincode = address.pincode;
    newEmployee.address = newAddress;

    return this.employeeRepository.save(newEmployee);
  };

  // updateEmployee = async (
  //   id: number,
  //   employeeUpdates: QueryDeepPartialEntity<Employee>
  // ) => {
  //   const updateEmployee = this.getEmployeeById(id);

  //   return this.employeeRepository.update({ id }, employeeUpdates);
  // };

  updateEmployeeById = async (
    id: number,
    name: string,
    email: string,
    age: number,
    address: UpdateAddressDto
  ) => {
    const existingEmployee = await this.getEmployeeById(id);
    existingEmployee.name = name;
    existingEmployee.email = email;
    existingEmployee.age = age;
    if (address) {
      existingEmployee.address.line1 = address.line1;
      existingEmployee.address.pincode = address.pincode;
    }

    return this.employeeRepository.save(existingEmployee);
  };

  deleteEmployee = async (id: number) => {
    return this.employeeRepository.softRemove(id);
  };

  loginEmployee = async (email: string, password: string) => {
    const employee = await this.employeeRepository.findOneBy({ email });

    if (!employee) {
      throw new EntityNotFoundException(ErrorCodes.EMPLOYEE_WITH_ID_NOT_FOUND);
    }

    const result = await bcrypt.compare(password, employee.password);

    if (!result) {
      throw new IncorrectPasswordException(ErrorCodes.INCORRECT_PASSWORD);
    }

    const payload: jwtPayload = {
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };

    const token = jsonwebtoken.sign(payload, JWT_SECRET, {
      expiresIn: JWT_VALIDITY,
    });
    return { token };
  };
}

export default EmployeeService;
