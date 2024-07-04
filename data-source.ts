import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Employee } from "./Employee";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  database: "training",
  username: "Dheeraj",
  password: "Dheeraj",
  extra: { max: 5, min: 2 },
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [Employee],
});

export default dataSource;
