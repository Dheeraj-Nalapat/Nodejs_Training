import { plainToInstance } from "class-transformer";
import HttpException from "../exceptions/http.exceptions";
import EmployeeService from "../service/employee.service";
import express from "express";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../dto/employee.dto";
import { validate } from "class-validator";
import { UpdateAddressDto } from "../dto/address.dto";
import errorsToJson from "../../errorstojson";
import { RequestWithUser } from "../utils/requestWithUser";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import { ErrorCodes } from "../utils/error.code";

class EmployeeController {
  public router: express.Router;

  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();

    this.router.get("/", this.getAllEmployees);
    this.router.get("/:id", this.getEmployeeById);
    this.router.post("/", authorize, this.createEmployee);
    this.router.put("/:id", authorize, this.updateEmployee);
    this.router.patch("/:id", authorize, this.updateEmployee);
    this.router.delete("/:id", authorize, this.deleteEmployee);
    this.router.post("/login", this.loginEmployee);
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
        throw ErrorCodes.EMPLOYEE_WITH_ID_NOT_FOUND;
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
        throw ErrorCodes.UNAUTHORIZED;
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
        employeeDto.experience,
        employeeDto.password,
        employeeDto.role,
        employeeDto.status,
        employeeDto.address,
        employeeDto.department
      );
      res.status(201).send(newEmployee);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  public updateEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role != Role.HR) {
        throw ErrorCodes.UNAUTHORIZED;
      }
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
        employeeDto.experience,
        employeeDto.password,
        employeeDto.role,
        employeeDto.status,
        employeeDto.address ? updateAddress : undefined,
        employeeDto.department
      );
      if (!updatedEmployee) {
        throw ErrorCodes.EMPLOYEE_WITH_ID_NOT_FOUND;
      }
      res.status(204).send(updatedEmployee);
    } catch (err) {
      next(err);
    }
  };

  public deleteEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role != Role.HR) {
        throw ErrorCodes.UNAUTHORIZED;
      }
      const employeeId = Number(req.params.id);
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
