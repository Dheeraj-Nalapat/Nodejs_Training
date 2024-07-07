import { Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository {
  constructor(private repository: Repository<Department>) {}

  find = async () => {
    return this.repository.find();
  };

  findOneBy = async (filter: Partial<Department>) => {
    return this.repository.findOne({ where: filter });
  };

  save = async (department: Department) => {
    return this.repository.save(department);
  };

  softRemove = async (id: number) => {
    return this.repository.softRemove({ id });
  };
}

export default DepartmentRepository;
