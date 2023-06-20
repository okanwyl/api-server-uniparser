import { Router } from "express";
import { InstructorController } from "../controllers/InstructorController";
import { PublicationController } from "../controllers/PublicationController";

export class PublicationRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes(): void {
    this.router.get("/publication/", PublicationController.getPublication);
    this.router.put(
      "/publication/:id",
      PublicationController.updatePublication
    );
  }
}
