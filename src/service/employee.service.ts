import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";
import { Role } from "../utils/role.enum";
import bcrypt from "bcrypt";
import IncorrectPasswordException from "../exceptions/incorrectPassword.exception";
import EntityNotFoundException from "../exceptions/entityNotFound.exception";
import { jwtPayload } from "../utils/jwtPayload";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import jsonwebtoken from "jsonwebtoken";
import { ErrorCodes } from "../utils/error.code";
import { CreateAddressDto, UpdateAddressDto } from "../dto/address.dto";
import DepartmentService from "./department.service";
import { Status } from "../utils/status.enum";

class EmployeeService {
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentService: DepartmentService
  ) {}

  getAllEmployee = async () => {
    const employees = await this.employeeRepository.find();
    return employees.map((employee) => {
      const { password, ...employeeWithoutPassword } = employee;
      return employeeWithoutPassword;
    });
  };

  getEmployeeById = async (id: number) => {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (employee) {
      const { password, ...employeeWithoutPassword } = employee;
      return employeeWithoutPassword;
    }
    return null;
  };

  createEmployee = async (
    name: string,
    email: string,
    experience: number,
    password: string,
    role: Role,
    status: Status,
    address: CreateAddressDto,
    department: string
  ) => {
    const newEmployee = new Employee();
    newEmployee.name = name;
    newEmployee.email = email;
    newEmployee.experience = experience;
    newEmployee.password = password ? await bcrypt.hash(password, 10) : "";
    newEmployee.role = role;
    newEmployee.status = status;

    const newAddress = new Address();
    newAddress.line1 = address.line1;
    newAddress.pincode = address.pincode;
    newEmployee.address = newAddress;

    const departmentEntity = await this.departmentService.getDepartmentByName(
      department
    );

    if (!departmentEntity) {
      throw new EntityNotFoundException({
        CODE: "DEPARTMENT_NOT_FOUND",
        MESSAGE: "Department not found",
      });
    }

    newEmployee.department = departmentEntity;

    return this.employeeRepository.save(newEmployee);
  };

  updateEmployeeById = async (
    id: number,
    name: string,
    email: string,
    experience: number,
    password: string,
    role: Role,
    status: Status,
    address: UpdateAddressDto,
    department: string
  ) => {
    const existingEmployee = await this.employeeRepository.findOneBy({ id });
    if (!existingEmployee) {
      throw ErrorCodes.EMPLOYEE_WITH_ID_NOT_FOUND;
    }
    existingEmployee.name = name;
    existingEmployee.email = email;
    existingEmployee.experience = experience;

    if (password) {
      existingEmployee.password = password
        ? await bcrypt.hash(password, 10)
        : "";
    }
    existingEmployee.role = role;
    existingEmployee.status = status;

    if (address) {
      existingEmployee.address.line1 = address.line1;
      existingEmployee.address.pincode = address.pincode;
    }

    const departmentEntity = await this.departmentService.getDepartmentByName(
      department
    );

    if (department && !departmentEntity) {
      throw new EntityNotFoundException({
        CODE: "DEPARTMENT_NOT_FOUND",
        MESSAGE: "Department not found",
      });
    }

    if (department) {
      existingEmployee.department = departmentEntity;
    }

    return this.employeeRepository.save(existingEmployee);
  };

  deleteEmployee = async (id: number) => {
    const employee = await this.getEmployeeById(id);

    if (!employee) {
      throw ErrorCodes.EMPLOYEE_WITH_ID_NOT_FOUND;
    }
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
