import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name: string;
}
