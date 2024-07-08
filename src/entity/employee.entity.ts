import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import AbstractEntity from "./abstract-entity";
import Address from "./address.entity";
import { Role } from "../utils/role.enum";
import Department from "./department.entity";
import { join } from "path";

@Entity()
class Employee extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  role: Role;

  @OneToOne(() => Address, (address) => address.employee, {
    cascade: true,
    onDelete: "CASCADE",
  })
  address: Address;

  @ManyToOne(() => Department, (department) => department.employee)
  department: Department;
}

export default Employee;
