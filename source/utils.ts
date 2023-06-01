import fs from "fs";
import path from "path";
import { UniversityName } from "./university";
import { CSVFile } from "./csv";
import { fileURLToPath } from "url";

const REGEX_PATTERN = /^(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})-(\w+)\.csv$/;
export const PUBLIC_FOLDER_NAME = __dirname + "/public";

export function getCSVFilesInFolder(folderPath: string): CSVFile[] {
  const files: CSVFile[] = [];

  const folderContents = fs.readdirSync(folderPath);

  for (const item of folderContents) {
    const itemPath = path.join(item);
    const stats = fs.statSync(itemPath);
    if (stats.isFile()) {
      if (path.extname(itemPath) === ".csv") {
        const match = itemPath.match(REGEX_PATTERN);
        const destinationFilePath = `${PUBLIC_FOLDER_NAME}/${itemPath}`;
        console.log(destinationFilePath);

        if (match) {
          const a = match;
          const [, dateTime, uniInitials] = match;
          if (
            !_isValidUniversityNameEnumKey(uniInitials.toUpperCase()) &&
            !itemPath.includes("clean")
          ) {
            throw new Error("ERROR: Not valid initials in csv file");
          }
          const obj = new CSVFile(itemPath, uniInitials, stats, dateTime);

          if (fs.existsSync(destinationFilePath)) {
            console.log(
              `File ${itemPath} already exists in the destination folder.`
            );
          } else {
            fs.copyFile(itemPath, destinationFilePath, (err) => {
              if (err) {
                console.error(`Error copying file ${itemPath}:`, err);
              } else {
                console.log(`File ${itemPath} copied successfully.`);
              }
            });
          }
          files.push(obj);
        }
      }
    }
  }
  return files;
}

function _isValidUniversityNameEnumKey(key: string): boolean {
  return UniversityName.hasOwnProperty(key);
}

export function createPublicFolderIfNotExist(): void {
  if (!fs.existsSync(PUBLIC_FOLDER_NAME)) {
    fs.mkdirSync(PUBLIC_FOLDER_NAME);
    console.log("Public folder created successfully.");
  } else {
    console.log("Public folder already exists.");
  }
}
