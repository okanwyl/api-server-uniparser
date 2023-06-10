import { Request, Response } from "express";
import CourseService from "../service/CourseService";
import { CourseNotFound } from "../types/Errors";

export class CourseController {
  public static async getCourse(req: Request, res: Response): Promise<void> {
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

  public static async getCourseByID(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (isNaN(Number(id))) {
        res.status(400).send({
          message: "Bad request parameter",
          success: false,
        });
        return;
      }
      const courses = await CourseService.findCourseByIDOrFail(Number(id));
      res.status(200).json({
        message: "Fetched course",
        success: true,
        data: courses,
      });
    } catch (err) {
      if (err instanceof CourseNotFound) {
        res.status(404).json({
          message: "Not found."
        }).end()
      }
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }
}
