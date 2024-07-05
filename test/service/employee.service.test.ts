import { getRepository } from "typeorm";
import EmployeeRepository from "../../src/repository/employee.repository";
import { Employee } from "../../src/entity/employee.entity";
import EmployeeService from "../../src/service/employee.service";
import { when } from "jest-when";

describe("Employee Service", () => {
  let employeeRepository: EmployeeRepository;
  let employeeService: EmployeeService;
  beforeAll(() => {
    const dataSource = {
      getRepository: jest.fn(),
    };
    employeeRepository = new EmployeeRepository(
      dataSource.getRepository(Employee)
    );
    employeeService = new EmployeeService(employeeRepository);
  });

  it("should return all employees", async () => {
    const mock = jest.fn(employeeRepository.find).mockResolvedValue([]);
    employeeRepository.find = mock;

    const users = await employeeService.getAllEmployee();
    expect(users).toEqual([]);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("should return expected employee", async () => {
    const mock = jest.fn();
    when(mock)
      .calledWith({ id: 2 })
      .mockResolvedValue({
        id: 2,
        name: "Aparna",
        age: 22,
        address: { line1: "address 2" },
      } as Employee);
    employeeRepository.findOneBy = mock;
    const users = await employeeService.getEmployeeById(2);
    expect(users.name).toEqual("Aparna");
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
