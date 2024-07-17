import { when } from "jest-when";
import Department from "../../src/entity/department.entity";
import DepartmentRepository from "../../src/repository/department.repository";
import DepartmentService from "../../src/service/department.service";
import { departmentTestCase } from "../dummy.data";
import EntityNotFoundException from "../../src/exceptions/entityNotFound.exception";

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

  it("Should create a department and return", async () => {
    const mock = jest.fn(departmentRepository.save);
    mock.mockResolvedValue(departmentTestCase[0]);
    departmentRepository.save = mock;

    const department = await departmentService.createDepartment(
      departmentTestCase[0].name
    );
    expect(department.name).toEqual("Software Development");
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("Should update department", async () => {
    const mockSave = jest.fn(departmentRepository.save);
    mockSave.mockResolvedValue(departmentTestCase[1]);
    departmentRepository.save = mockSave;

    const mockFindoneBy = jest.fn(departmentService.getDepartmentById);
    mockFindoneBy.mockResolvedValue(departmentTestCase[0]);
    departmentService.getDepartmentById = mockFindoneBy;

    const department = await departmentService.updateDepartmentById(
      12,
      "Software Development"
    );
    expect(department.name).toEqual("Software Development");
    expect(mockFindoneBy).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it("Should delete department", async () => {
    const mockFindoneBy = jest.fn(departmentService.getDepartmentById);
    when(mockFindoneBy)
      .calledWith(12)
      .mockResolvedValue(departmentTestCase[0])
      .calledWith(1)
      .mockResolvedValue(null);
    departmentService.getDepartmentById = mockFindoneBy;

    const mockSoftRemove = jest.fn(departmentRepository.softRemove);
    mockSoftRemove.mockResolvedValue(null);
    departmentRepository.softRemove = mockSoftRemove;

    try {
      const department = await departmentService.deleteDepartmentById(12);
      expect(department).toEqual(null);
      expect(mockFindoneBy).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(true).toEqual(false);
    }

    try {
      const department = await departmentService.deleteDepartmentById(1);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        expect(error.message).toEqual("Department not found");
      }
    }
  });
});
