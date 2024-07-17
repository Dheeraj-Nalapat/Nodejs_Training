import Department from "../entity/department.entity";
import EntityNotFoundException from "../exceptions/entityNotFound.exception";
import DepartmentRepository from "../repository/department.repository";
import { ErrorCodes } from "../utils/error.code";

class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  getAllDepartment = async () => {
    return this.departmentRepository.find();
  };

  getDepartmentById = async (id: number) => {
    return this.departmentRepository.findOneBy({ id });
  };

  getDepartmentByName = async (name: string) => {
    return this.departmentRepository.findOneBy({ name });
  };

  createDepartment = async (name: string) => {
    const newDepartment = new Department();
    newDepartment.name = name;
    return this.departmentRepository.save(newDepartment);
  };

  updateDepartmentById = async (id: number, name: string) => {
    const existingDepartment = await this.getDepartmentById(id);
    existingDepartment.name = name;
    return this.departmentRepository.save(existingDepartment);
  };

  deleteDepartmentById = async (id: number) => {
    const department = await this.getDepartmentById(id);
    console.log(department);
    if (!department) {
      throw new EntityNotFoundException({
        CODE: "DEPARTMENT_NOT_FOUND",
        MESSAGE: "Department not found",
      });
    }
    console.log(department.name);
    if (department.employee.length > 0) {
      throw ErrorCodes.DELETION_CONSTRAINT_ERROR;
    }
    return this.departmentRepository.softRemove(id);
  };
}

export default DepartmentService;
