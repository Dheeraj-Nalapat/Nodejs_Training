import { Repository } from "typeorm";
import dataSource from "../db/data-source.db";
import { Employee } from "../entity/employee.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class EmployeeRepository {
  constructor(private repository: Repository<Employee>) {}

  find = async () => {
    return this.repository.find({ relations: ["address"] });
  };

  findOneBy = async (filter: Partial<Employee>) => {
    return this.repository.findOne({ where: filter, relations: ["address"] });
  };

  save = async (employee: Employee): Promise<Employee> => {
    return this.repository.save(employee);
  };

  update = async (
    filter: Partial<Employee>,
    employeeUpdates: QueryDeepPartialEntity<Employee>
  ): Promise<Employee> => {
    const as = await this.repository.update(filter, employeeUpdates);
    console.log(filter);
    return this.findOneBy(filter);
  };

  softDelete = async (id: number): Promise<void> => {
    await this.repository.softDelete({ id });
  };

  softRemove = async (id: number): Promise<void> => {
    await this.repository.softRemove({ id });
  };
}

export default EmployeeRepository;
