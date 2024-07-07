import { plainToInstance } from "class-transformer";
import HttpException from "../exceptions/http.exceptions";
import EmployeeService from "../service/employee.service";
import express from "express";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../dto/employee.dto";
import { validate } from "class-validator";
import { CreateAddressDto, UpdateAddressDto } from "../dto/address.dto";
import errorsToJson from "../../errorstojson";
import { RequestWithUser } from "../utils/requestWithUser";
import authorize from "../middleware/authorize.middleware";
import { AnyBulkWriteOperation } from "typeorm";
import { Role } from "../utils/role.enum";

class EmployeeController {
  public router: express.Router;

  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();

    this.router.get("/", this.getAllEmployees);
    this.router.get("/:id", this.getEmployeeById);
    this.router.put("/:id", this.updateEmployee);
    this.router.patch("/:id", this.updateEmployee);
    this.router.delete("/:id", this.deleteEmployee);
    this.router.post("/login", this.loginEmployee);
    this.router.post("/", authorize, this.createEmployee);
  }

  public getAllEmployees = async (
    req: express.Request,
    res: express.Response
  ) => {
    const employees = await this.employeeService.getAllEmployee();
    res.status(200).send(employees);
  };

  public getEmployeeById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employee = await this.employeeService.getEmployeeById(employeeId);

      if (!employee) {
        const error = new HttpException(
          404,
          `No employee found with id: ${req.params.id}`
        );
        throw error;
      }

      res.status(200).send(employee);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  public createEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role != Role.HR) {
        throw new HttpException(
          403,
          "You are not authorized to create employee"
        );
      }
      const employeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(employeeDto);
      if (errors.length) {
        console.log(errorsToJson(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const newEmployee = await this.employeeService.createEmployee(
        employeeDto.name,
        employeeDto.email,
        employeeDto.age,
        employeeDto.password,
        employeeDto.role,
        employeeDto.address
      );
      res.status(201).send(newEmployee);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  public updateEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeDto = plainToInstance(UpdateEmployeeDto, req.body);
      const errors = await validate(employeeDto);
      if (errors.length) {
        console.log(errorsToJson(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const employeeId = Number(req.params.id);
      const updateAddress = new UpdateAddressDto();
      if (employeeDto.address) {
        updateAddress.line1 = employeeDto.address.line1;
        updateAddress.pincode = employeeDto.address.pincode;
      }
      const updatedEmployee = await this.employeeService.updateEmployeeById(
        employeeId,
        employeeDto.name,
        employeeDto.email,
        employeeDto.age,
        employeeDto.address ? updateAddress : undefined
      );
      if (!updatedEmployee) {
        const error = new HttpException(404, "Employee not found");
        throw error;
      }
      res.status(204).send(updatedEmployee);
    } catch (err) {
      next(err);
    }
  };

  public deleteEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employee = await this.employeeService.getEmployeeById(employeeId);

      if (!employee) {
        const error = new HttpException(
          404,
          `No employee found with id: ${req.params.id}`
        );
        throw error;
      }
      const deletedEmployee = await this.employeeService.deleteEmployee(
        employeeId
      );
      res.status(204).send(deletedEmployee);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  public loginEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body;
    try {
      const token = await this.employeeService.loginEmployee(email, password);
      res.status(200).send({ data: token });
    } catch (error) {
      next(error);
    }
  };
}

export default EmployeeController;
