import express from "express";
import bodyParser from "body-parser";
import { Response, Request } from "express";
import employeeRouter from "./routes/employee.routes";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/data-source.db";
import { error } from "console";
import { request } from "http";
import HttpException from "./exceptions/http.exceptions";
import errorMiddleware from "./middleware/error.middleware";
const server = express();
import dotenv from "dotenv";
import departmentRouter from "./routes/department.routes";
dotenv.config();

server.use(bodyParser.json());
server.use(loggerMiddleware);
server.use("/department", departmentRouter);
server.use("/employee", employeeRouter);
server.use(errorMiddleware);

server.get("/", (req: Request, res: Response) => {
  console.log(req.url);
  res.status(200).send("this is the employee page");
});

(async () => {
  try {
    await dataSource.initialize();
  } catch (e) {
    console.log("Failed", e);
    process.exit(1);
  }
  server.listen(3000, () => {
    console.log("Server listening at 3000");
  });
})();
