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
import { CreateDepartmentDto, UpdateDepartmentDto } from "./department.dto";

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
  @IsString()
  department: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;

  @IsOptional()
  @IsString()
  department: string;
}
