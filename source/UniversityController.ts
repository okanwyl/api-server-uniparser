import { Request, Response } from "express";
import UniversityService from "./service/UniversityService";

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
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }
}
