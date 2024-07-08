import EmployeeRepository from "../../src/repository/employee.repository";
import Employee from "../../src/entity/employee.entity";
import EmployeeService from "../../src/service/employee.service";
import { when } from "jest-when";
import { departmentTestCase, employeeTestCase } from "../dummy.data";
import DepartmentRepository from "../../src/repository/department.repository";
import Department from "../../src/entity/department.entity";
import DepartmentService from "../../src/service/department.service";

describe("Employee Service", () => {
  let employeeRepository: EmployeeRepository;
  let departmentRepository: DepartmentRepository;
  let departmentService: DepartmentService;
  let employeeService: EmployeeService;
  beforeAll(() => {
    const dataSource = {
      getRepository: jest.fn(),
    };
    employeeRepository = new EmployeeRepository(
      dataSource.getRepository(Employee)
    ) as jest.Mocked<EmployeeRepository>;
    departmentRepository = new DepartmentRepository(
      dataSource.getRepository(Department)
    ) as jest.Mocked<DepartmentRepository>;
    departmentService = new DepartmentService(departmentRepository);
    employeeService = new EmployeeService(
      employeeRepository,
      departmentService
    );
  });

  it("should create expected employee", async () => {
    const mockEmployee = jest.fn(employeeRepository.save);
    mockEmployee.mockResolvedValue(employeeTestCase[0]);
    employeeRepository.save = mockEmployee;

    const mockDepartment = jest.fn(departmentService.getDepartmentByName);
    mockDepartment.mockResolvedValue(departmentTestCase[0]);
    departmentService.getDepartmentByName = mockDepartment;

    const users = await employeeService.createEmployee(
      employeeTestCase[0].name,
      employeeTestCase[0].email,
      employeeTestCase[0].age,
      employeeTestCase[0].password,
      employeeTestCase[0].role,
      employeeTestCase[0].address,
      employeeTestCase[0].department.name
    );
    expect(users.name).toEqual("employee1");
    expect(mockEmployee).toHaveBeenCalledTimes(1);
    expect(mockDepartment).toHaveBeenCalledTimes(1);
  });

  it("should return all employees", async () => {
    const mock = jest
      .fn(employeeRepository.find)
      .mockResolvedValue(employeeTestCase);
    employeeRepository.find = mock;

    const users = await employeeService.getAllEmployee();
    expect(users).toEqual(employeeTestCase);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("should return expected employee", async () => {
    const mock = jest.fn();
    when(mock).calledWith({ id: 1 }).mockResolvedValue(employeeTestCase[0]);
    employeeRepository.findOneBy = mock;
    const users = await employeeService.getEmployeeById(1);
    expect(users.name).toEqual("employee1");
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("should return the updated employee", async () => {
    const mockFindoneBy = jest.fn(employeeRepository.findOneBy);
    mockFindoneBy.mockResolvedValue(employeeTestCase[0]);
    employeeRepository.findOneBy = mockFindoneBy;

    const mockSave = jest.fn(employeeRepository.save);
    mockSave.mockResolvedValue(employeeTestCase[1]);
    employeeRepository.save = mockSave;

    const mockGetDepartmentByName = jest.fn(
      departmentService.getDepartmentByName
    );
    mockGetDepartmentByName.mockResolvedValue(undefined);
    departmentService.getDepartmentByName = mockGetDepartmentByName;

    const users = await employeeService.updateEmployeeById(
      1,
      "employee2",
      undefined,
      22,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(users.age).toEqual(22);
    expect(users.name).toEqual("employee2");
    expect(mockFindoneBy).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it("should return void promise", async () => {
    const mockGetEmployeeWithId = jest.fn(employeeService.getEmployeeById);
    mockGetEmployeeWithId.mockResolvedValue(employeeTestCase[0]);
    employeeService.getEmployeeById = mockGetEmployeeWithId;

    const mockSoftRemove = jest.fn(employeeRepository.softRemove);
    mockSoftRemove.mockResolvedValue(null);
    employeeRepository.softRemove = mockSoftRemove;

    const users = await employeeService.deleteEmployee(1);
    expect(users).toEqual(null);
    expect(mockGetEmployeeWithId).toHaveBeenCalledTimes(1);
  });
});
