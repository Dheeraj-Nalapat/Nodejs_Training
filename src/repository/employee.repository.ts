import { Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
  constructor(private repository: Repository<Employee>) {}

  find = async () => {
    return this.repository.find({ relations: ["address", "department"] });
  };

  findOneBy = async (filter: Partial<Employee>) => {
    return this.repository.findOne({
      where: filter,
      relations: ["address", "department"],
    });
  };

  save = async (employee: Employee): Promise<Employee> => {
    return this.repository.save(employee);
  };

  softDelete = async (id: number): Promise<void> => {
    await this.repository.softDelete({ id });
  };

  softRemove = async (id: number): Promise<void> => {
    await this.repository.softRemove({ id });
  };
}

export default EmployeeRepository;
