import express from "express";
import bodyParser from "body-parser";
import { Response, Request } from "express";
import { employeeRouter } from "./employeeRouter";
import loggerMiddleware from "./loggerMiddleware";
import dataSource from "./data-source";
const server = express();

server.use(bodyParser.json());
server.use(loggerMiddleware);
server.use("/employee", employeeRouter);

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
