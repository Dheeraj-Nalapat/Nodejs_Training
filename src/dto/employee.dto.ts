import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateAddressDto, UpdateAddressDto } from "./address.dto";
import "reflect-metadata";
import { Type } from "class-transformer";
import { Role } from "../utils/role.enum";
import Department from "../entity/department.entity";
import { CreateDepartment, UpdateDepartment } from "./department.dto";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDepartment)
  department: CreateDepartment;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateDepartment)
  department: UpdateDepartment;
}
