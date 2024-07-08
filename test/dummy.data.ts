import Department from "../src/entity/department.entity";
import Employee from "../src/entity/employee.entity";
import { Role } from "../src/utils/role.enum";

let employeeTestCase: Employee[];
let departmentTestCase: Department[];

employeeTestCase = [
  {
    id: 2,
    createdAt: new Date("2024-07-07T07:08:50.883Z"),
    updatedAt: new Date("2024-07-07T13:47:25.852Z"),
    deletedAt: null,
    name: "employee1",
    age: 20,
    email: "employee1@gmail",
    password: "employee1",
    role: Role.DEVELOPER,
    address: {
      id: 2,
      createdAt: new Date("2024-07-07T07:08:50.883Z"),
      updatedAt: new Date("2024-07-07T07:08:50.883Z"),
      deletedAt: null,
      line1: "address1",
      pincode: "123456",
      employee: new Employee(),
    },
    department: {
      id: 12,
      createdAt: new Date("2024-07-07T11:33:11.015Z"),
      updatedAt: new Date("2024-07-07T11:33:11.015Z"),
      deletedAt: null,
      name: "Software Development",
      head_id: null,
      employee: [],
    },
  },
  {
    id: 2,
    createdAt: new Date("2024-07-07T07:08:50.883Z"),
    updatedAt: new Date("2024-07-07T13:47:25.852Z"),
    deletedAt: null,
    name: "employee2",
    age: 22,
    email: "employee1@gmail",
    password: "employee1",
    role: Role.DEVELOPER,
    address: {
      id: 2,
      createdAt: new Date("2024-07-07T07:08:50.883Z"),
      updatedAt: new Date("2024-07-07T07:08:50.883Z"),
      deletedAt: null,
      line1: "address1",
      pincode: "123456",
      employee: new Employee(),
    },
    department: {
      id: 12,
      createdAt: new Date("2024-07-07T11:33:11.015Z"),
      updatedAt: new Date("2024-07-07T11:33:11.015Z"),
      deletedAt: null,
      name: "Software Development",
      head_id: null,
      employee: [],
    },
  },
];

departmentTestCase = [
  {
    id: 12,
    createdAt: new Date("2024-07-07T11:33:11.015Z"),
    updatedAt: new Date("2024-07-07T11:33:11.015Z"),
    deletedAt: null,
    name: "Software Development",
    head_id: null,
    employee: [],
  },
];
export { employeeTestCase, departmentTestCase };
