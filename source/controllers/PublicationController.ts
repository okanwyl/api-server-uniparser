import { Request, Response } from "express";
import PublicationService from "../service/PublicationService";
import { PublicationNotFound } from "../types/Errors";
import { PublicationType } from "../entity/PublicationType";

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
        res
          .status(404)
          .json({
            message: "Not found.",
          })
          .end();
      }
      res.status(500).send({
        message: "INTERNAL SERVER ERROR, please try again later.",
        success: false,
      });
    }
  }

  public static async updatePublication(
    req: Request,
    res: Response
  ): Promise<void> {
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

      const publication = await PublicationService.findPublicationByIDOrFail(
        Number(id)
      );

      publication.publication_type = model_output as PublicationType;
      await publication.save();

      await publication.save();
      res.status(200).send({
        message: "Publication updated successfully.",
        success: true,
        data: publication,
      });
      return;
    } catch (err: unknown) {
      if (err instanceof PublicationNotFound) {
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
