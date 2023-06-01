import { CSV } from "./csv";

export enum UniversityName {
  EGE = "EGE University",
}

export interface University {
  name: UniversityName;
  initials: string;
  parsed_from_url: URL;
  csv: CSV;
}
