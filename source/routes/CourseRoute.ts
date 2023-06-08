import { Router } from "express";
import { UniversityController } from "../controllers/UniversityController";
import { CourseController } from "../controllers/CourseController";

export class CourseRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes(): void {
    this.router.get("/course/", CourseController.getCourse);
    this.router.get("/course/:id", CourseController.getCourseByID);
  }
}
