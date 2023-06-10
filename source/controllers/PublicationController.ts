import { Request, Response } from "express";
import PublicationService from "../service/PublicationService";
import { PublicationNotFound } from "../types/Errors";

export class PublicationController {
  public static async getPublication(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const publications = await PublicationService.getAllPublications();
      res.status(200).send({
        message: "All available publications",
        success: true,
        data: publications,
      });
    } catch (err) {
      console.log(err);
      if (err instanceof PublicationNotFound) {
        res.status(404).json({
          message: "Not found."
        }).end()
      }
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }
}
