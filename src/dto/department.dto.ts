import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartment {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateDepartment {
  @IsOptional()
  @IsString()
  name: string;
}
