import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { University } from "./entity/University";
import { Course } from "./entity/Course";
import "reflect-metadata";
import { Instructor } from "./entity/Instructor";
import { Publication } from "./entity/Publication";
dotenv.config();

function buildDatabaseConfigFromSource(): {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} {
  const requiredEnvVariables = [
    "DB_HOST",
    "DB_PORT",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_DATABASE",
  ];

  const missingEnvVariables: string[] = [];

  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      missingEnvVariables.push(variable);
    }
  });

  if (missingEnvVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingEnvVariables.join(", ")}`
    );
  }

  const config = {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT)!,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
  };

  return config;
}

const config = buildDatabaseConfigFromSource();
const databaseSource = new DataSource({
  type: "mysql",
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  logging: "all",
  logger: "simple-console",
  synchronize: true,
  cache: true,
  entities: [University, Course, Instructor, Publication],
});

export default databaseSource;
