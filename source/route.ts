import { Router } from "express";
import { CSVController as CSVController } from "./controller";

export class CSVRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes(): void {
    this.router.get("/", CSVController.getAllCSV);
    this.router.get("/file/:filename", CSVController.downloadCSV);
  }
}
