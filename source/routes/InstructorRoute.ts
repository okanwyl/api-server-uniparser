import { Router } from "express";
import { InstructorController } from "../controllers/InstructorController";

export class InstructorRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes(): void {
    this.router.get("/instructor/", InstructorController.getInstructor);
  }
}