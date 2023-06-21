import { Request, Response } from "express";
import CourseService from "../service/CourseService";
import { CourseNotFound } from "../types/Errors";
import { PublicationType } from "../entity/PublicationType";

export class CourseController {
  public static async getCourse(req: Request, res: Response) {
    try {
      const param = req.query.uni as string;
      if (param !== undefined) {
        const courses = await CourseService.getAllCoursesByUniversityID(
          Number(param)
        );
        return res.status(200).send({
          message: "All available courses",
          success: true,
          data: courses,
        });
      }

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
        res
          .status(404)
          .json({
            message: "Not found.",
          })
          .end();
      }
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }

  public static async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const model_output = req.body.model_output as PublicationType;

      // Check is model_output is in PublicationType
      if (!Object.values(PublicationType).includes(model_output)) {
        res.status(400).send({
          message: "Bad request, please check your request body.",
          success: false,
        });
        return;
      }

      const course = await CourseService.findCourseByIDOrFail(Number(id));
      course.type = model_output as PublicationType;

      await course.save();

      res.status(200).send({
        message: "Course updated successfully.",
        success: true,
        data: course,
      });

      return;
    } catch (err) {
      if (err instanceof CourseNotFound) {
        res.status(404).json({
          message: "Not found.",
        });
        return;
      }
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }
}
