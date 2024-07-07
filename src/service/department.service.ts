import Department from "../entity/department.entity";
import Employee from "../entity/employee.entity";
import DepartmentRepository from "../repository/department.repository";
import EmployeeRepository from "../repository/employee.repository";

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

  createDepartment = async (name: string, head_id: number) => {
    const newDepartment = new Department();
    newDepartment.name = name;
    newDepartment.head_id = head_id;
    return this.departmentRepository.save(newDepartment);
  };

  updateDepartmentById = async (id: number, name: string, head_id: number) => {
    const existingDepartment = await this.getDepartmentById(id);
    existingDepartment.name = name;
    existingDepartment.head_id = head_id;
    return this.departmentRepository.save(existingDepartment);
  };

  deleteDepartmentById = async (id: number) => {
    return this.departmentRepository.softRemove(id);
  };
}

export default DepartmentService;
