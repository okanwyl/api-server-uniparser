import fs from "fs";
import { UniversityName } from "./university";
import { PUBLIC_FOLDER_NAME } from "./utils";

type STATE = "default" | "clean";

export interface CSV {
  filename: string;
  uni_initials: string;
  university_n: UniversityName;
  io_last_access: Date;
  io_last_modification: Date;
  io_created_at: Date;
  io_size: number;
  fn_date: string;
  state: STATE;
  href: string;
}
export class CSVFile implements CSV {
  filename: string;
  uni_initials: string;
  university_n: UniversityName;
  io_last_access: Date;
  io_last_modification: Date;
  io_created_at: Date;
  io_size: number;
  fn_date: string;
  state: STATE;
  href: string;

  constructor(
    filename: string,
    uni_initials: string,
    stats: fs.Stats,
    fn_date: string
  ) {
    this.filename = filename;
    this.uni_initials = uni_initials;
    this.university_n =
      UniversityName[
        this._defineUniversityName(uni_initials) as keyof typeof UniversityName
      ];

    this.io_last_access = stats.atime;

    this.io_last_modification = stats.mtime;
    this.io_created_at = stats.ctime;
    this.io_size = stats.size;
    this.fn_date = fn_date;
    this.state = filename.includes("clean") ? "clean" : "default";
    this.href =
      "http://" +
      process.env.URL +
      ":" +
      process.env.PORT +
      "/" +
      "file/" +
      filename;
  }

  private _defineUniversityName(uni_initials: string): string {
    if (uni_initials.includes("_clean")) {
      return uni_initials.replace(/_clean/g, "").toUpperCase();
    }
    return uni_initials.toUpperCase();
  }
}
