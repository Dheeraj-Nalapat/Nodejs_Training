import { when } from "jest-when";
import Department from "../../src/entity/department.entity";
import DepartmentRepository from "../../src/repository/department.repository";
import DepartmentService from "../../src/service/department.service";
import { departmentTestCase } from "../dummy.data";

describe("Department Service", () => {
  let departmentRepository: DepartmentRepository;
  let departmentService: DepartmentService;
  beforeAll(() => {
    const dataSource = {
      getRepository: jest.fn(),
    };
    departmentRepository = new DepartmentRepository(
      dataSource.getRepository(Department)
    );
    departmentService = new DepartmentService(departmentRepository);
  });

  it("should return all department", async () => {
    const mock = jest
      .fn(departmentRepository.find)
      .mockResolvedValue(departmentTestCase);
    departmentRepository.find = mock;

    const users = await departmentService.getAllDepartment();
    expect(users).toEqual(departmentTestCase);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("should return expected department", async () => {
    const mock = jest.fn(departmentRepository.findOneBy);
    when(mock).calledWith({ id: 12 }).mockResolvedValue(departmentTestCase[0]);
    console.log(departmentRepository);
    departmentRepository.findOneBy = mock;
    const users = await departmentService.getDepartmentById(12);
    expect(users.name).toEqual("Software Development");
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
