import { Request, Response } from "express";
import path from "path";
import { csv_files } from ".";

export class CSVController {
  public static async getAllCSV(req: Request, res: Response): Promise<void> {
    res.status(200).send({
      message: "Returned all available csv files",
      success: true,
      data: csv_files,
    });
  }

  public static async downloadCSV(req: Request, res: Response): Promise<void> {
    // Serve the specific file
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "public", filename);
    res.sendFile(filePath);
  }
}
