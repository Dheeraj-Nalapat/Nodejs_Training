import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  head_id: number;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  head_id: number;
}
