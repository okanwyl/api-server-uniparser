import { Request, Response } from "express";
import CourseService from "../service/CourseService";
import InstructorService from "../service/InstructorService";

export class InstructorController {
  public static async getInstructor(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const instructors = await InstructorService.getAllCourses();
      res.status(200).send({
        message: "All available instructors",
        success: true,
        data: instructors,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }
}
