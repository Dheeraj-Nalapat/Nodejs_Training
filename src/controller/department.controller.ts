import express from "express";
import DepartmentService from "../service/department.service";
import HttpException from "../exceptions/http.exceptions";
import { RequestWithUser } from "../utils/requestWithUser";
import { Role } from "../utils/role.enum";
import { plainToInstance } from "class-transformer";
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "../dto/department.dto";
import errorsToJson from "../../errorstojson";
import { validate } from "class-validator";
import authorize from "../middleware/authorize.middleware";
import EntityNotFoundException from "../exceptions/entityNotFound.exception";
import { ErrorCodes } from "../utils/error.code";
import dataSource from "../db/data-source.db";
import Employee from "../entity/employee.entity";

class DepartmentConroller {
  public router: express.Router;

  constructor(private departmentService: DepartmentService) {
    this.router = express.Router();

    this.router.get("/", this.getAllDepartment);
    this.router.get("/:id", this.getDepartmentById);
    this.router.post("/", authorize, this.createDepartment);
    this.router.patch("/:id", authorize, this.updateDepartmentById);
    this.router.delete("/:id", authorize, this.deleteDepartment);
  }

  public getAllDepartment = async (
    req: express.Request,
    res: express.Response
  ) => {
    const departments = await this.departmentService.getAllDepartment();
    res.status(200).send(departments);
  };

  public getDepartmentById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id);
      const department = await this.departmentService.getDepartmentById(
        departmentId
      );

      if (!department) {
        throw new EntityNotFoundException({
          CODE: "DEPARTMENT_NOT_FOUND",
          MESSAGE: "Department not found",
        });
      }

      res.status(200).send(department);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  public createDepartment = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role != Role.CEO) {
        throw ErrorCodes.UNAUTHORIZED;
      }
      const departmentDto = plainToInstance(CreateDepartmentDto, req.body);
      const errors = await validate(departmentDto);
      if (errors.length) {
        console.log(errorsToJson(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const newDepartment = await this.departmentService.createDepartment(
        departmentDto.name,
        departmentDto.head_id
      );
      res.status(201).send(newDepartment);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  public updateDepartmentById = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role != Role.CEO) {
        throw ErrorCodes.UNAUTHORIZED;
      }
      const departmentDto = plainToInstance(UpdateDepartmentDto, req.body);
      const errors = await validate(departmentDto);
      if (errors.length) {
        console.log(errorsToJson(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const departmentId = Number(req.params.id);
      const updatedDepartment =
        await this.departmentService.updateDepartmentById(
          departmentId,
          departmentDto.name,
          departmentDto.head_id
        );
      if (!updatedDepartment) {
        throw new EntityNotFoundException({
          CODE: "DEPARTMENT_NOT_FOUND",
          MESSAGE: "Department not found",
        });
      }
      res.status(204).send(updatedDepartment);
    } catch (err) {
      next(err);
    }
  };

  public deleteDepartment = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role != Role.CEO) {
        throw ErrorCodes.UNAUTHORIZED;
      }
      const departmentId = Number(req.params.id);
      const deletedDepartment =
        await this.departmentService.deleteDepartmentById(departmentId);
      res.status(204).send(deletedDepartment);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}

export default DepartmentConroller;
