import { Router } from "express";
import { UniversityController } from "../controllers/UniversityController";

export class UniversityRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes(): void {
    this.router.get("/university/", UniversityController.getUniversity);
  }
}
