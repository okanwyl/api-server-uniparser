import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { UniversityRoute } from "./routes/UniversityRoute";
import { CourseRoute } from "./routes/CourseRoute";

class APIServer {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.routes();
  }

  public routes(): void {
    this.app.use("/api", new UniversityRoute().router);
    this.app.use("/api", new CourseRoute().router);
  }

  public config(): void {
    this.app.use(express.json());
    this.app.use(morgan("dev"));

    this.app.use(bodyParser.json({ limit: "10mb" }));

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));

    this.app.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
  }

  public start(): void {
    this.app.listen(process.env.PORT, () => {
      console.log(`Started served at port ${process.env.PORT}`);
    });
  }
}

export default APIServer;
