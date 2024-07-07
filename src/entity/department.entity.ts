import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Employee from "./employee.entity";
import { IsOptional } from "class-validator";

@Entity()
class Department extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  @IsOptional()
  head_id: number;

  @OneToMany(() => Employee, (employee) => employee.department)
  employee: Employee[];
}

export default Department;
