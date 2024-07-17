import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Address from "./address.entity";
import { Role } from "../utils/role.enum";
import { Status } from "../utils/status.enum";
import Department from "./department.entity";

@Entity()
class Employee extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  experience: number;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  role: Role;

  @Column({ nullable: true })
  status: Status;

  @OneToOne(() => Address, (address) => address.employee, {
    cascade: true,
    onDelete: "CASCADE",
  })
  address: Address;

  @ManyToOne(() => Department, (department) => department.employee)
  department: Department;
}

export default Employee;
