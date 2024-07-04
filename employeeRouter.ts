import express from "express";
import { Response, Request } from "express";
import { Employee } from "./Employee";
import dataSource from "./data-source";
import { UpdateDateColumn } from "typeorm";
import { error } from "console";
const employeeRouter = express.Router();

employeeRouter.get("/", async (req: Request, res: Response) => {
  console.log(req.url);
  const employeeRepository = await dataSource.getRepository(Employee);
  const employees = await employeeRepository.find();
  res.status(200).send(employees);
});

employeeRouter.get("/:id", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  let employee: Employee;
  console.log(req.query);
  if (req.query.email) {
    employee = await employeeRepository.findOneBy({
      email: String(req.query.email),
    });
  } else {
    employee = await employeeRepository.findOneBy({
      id: Number(req.params.id),
    });
  }
  res.status(200).send(employee);
});

// employeeRouter.get("/:id", (req: Request, res: Response) => {
//   console.log(req.url);
//   const employee = employees.find(
//     (record) => record.id == Number(req.params.id)
//   );
//   res.status(200).send(employee);
// });

employeeRouter.post("/", async (req: Request, res: Response) => {
  const querryRunner = dataSource.createQueryRunner();

  try {
    await querryRunner.connect();
    await querryRunner.startTransaction();

    const newEmployee = new Employee();
    newEmployee.email = req.body.email;
    newEmployee.name = req.body.name;
    newEmployee.createdAt = new Date();
    newEmployee.updatedAt = new Date();

    const savedEmployee = await querryRunner.manager.save(newEmployee);
    await querryRunner.commitTransaction();
    res.status(201).send(savedEmployee);
  } catch (error) {
    console.log("ROLLBACK");
    await querryRunner.rollbackTransaction();
    res.status(500).send(error);
  } finally {
    await querryRunner.release();
  }
});

// employeeRouter.post("/", (req: Request, res: Response) => {
//   console.log(req.url);
//   console.log(req.body);
//   const employee = new Employee();
//   employee.id = employees.length + 1;
//   for (let property in req.body) {
//     if (property != "id") {
//       employee[property] = req.body[property];
//     }
//   }
//   employee.createdAt = new Date();
//   employee.updatedAt = new Date();
//   employees.push(employee);
//   res.status(201).send("New employee created");
// });

employeeRouter.put("/:id", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const updatedEmployee = await employeeRepository.findOneBy({
    id: Number(req.params.id),
  });
  for (let property in req.body) {
    updatedEmployee[property] = req.body[property];
  }
  const savedEmployee = await employeeRepository.save(updatedEmployee);
  res.status(200).send(savedEmployee);
});

// employeeRouter.put("/:id", (req: Request, res: Response) => {
//   console.log(req.url);
//   const employee = employees.find(
//     (record) => record.id == Number(req.params.id)
//   );
//   for (let property in req.body) {
//     employee[property] = req.body[property];
//   }
//   employee.updatedAt = new Date();
//   res.status(200).send("employee updated");
// });

employeeRouter.delete("/:id", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const deletedEmployee = await employeeRepository.softDelete({
    id: Number(req.params.id),
  });
  res.status(204).send(deletedEmployee);
});

// employeeRouter.delete("/:id", (req: Request, res: Response) => {
//   console.log(req.url);
//   const employeeIndex = employees.findIndex(
//     (record) => record.id == Number(req.params.id)
//   );
//   employees[employeeIndex].deletedAt = new Date();
//   employees.splice(employeeIndex, 1);
//   res.status(204).send();
// });

export { employeeRouter };
