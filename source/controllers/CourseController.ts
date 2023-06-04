import { Request, Response } from "express";
import CourseService from "../service/CourseService";

export class CourseController {
  public static async getCourse(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const courses = await CourseService.getAllCourses();
      res.status(200).send({
        message: "All available courses",
        success: true,
        data: courses,
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
