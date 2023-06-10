import { Request, Response } from "express";
import UniversityService from "../service/UniversityService";
import { UniversityNotFound } from "../types/Errors"
import InstructorService from "../service/InstructorService";
import CourseService from "../service/CourseService";

export class UniversityController {
  public static async getUniversity(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const universities = await UniversityService.getAllUniversities();
      res.status(200).send({
        message: "All available universities",
        success: true,
        data: universities,
      });
      return;
    } catch (err) {
      if (err instanceof UniversityNotFound) {
        res.status(404).json({
          message: "Not found."
        })
        return;
      }
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }

  public static async getGlobalInstructorMetric(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const universities = await UniversityService.getGlobalUniversityMetric();
      res.status(200).send({
        message: "All available instructor metrics",
        success: true,
        data: universities,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }

  public static async getUniversityByIDHandler(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (isNaN(Number(id))) {
        res.status(400).send({
          message: "Bad request parameter",
          success: false,
        });
        return;
      }
      const university = await UniversityService.findUniversityByIDOrFail(Number(id));
      res.status(200).json({
        message: "Fetched university",
        success: true,
        data: university,
      });
      return;

    } catch (err) {
      if (err instanceof UniversityNotFound) {
        res.status(404).json({
          message: "Not found."
        }).end()
        return;
      }
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }
  public static async getParameterByIDHandler(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (isNaN(Number(id))) {
        res.status(400).send({
          message: "Bad request parameter",
          success: false,
        });
        return;
      }
      const data = await UniversityService.findUniversityAndFetchParameters(Number(id));
      res.status(200).json({
        message: "Fetched university",
        success: true,
        data
      });
      return;

    } catch (err) {
      if (err instanceof UniversityNotFound) {
        res.status(404).json({
          message: "Not found."
        }).end()
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
