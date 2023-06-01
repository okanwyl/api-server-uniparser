import path from "path";
import APIServer from "./server";
import dotenv from "dotenv";
import { createPublicFolderIfNotExist, getCSVFilesInFolder } from "./utils";
import { CSVFile } from "./csv";

dotenv.config();

const FOLDER_PATH = process.env.FOLDER_PATH;

createPublicFolderIfNotExist();

if (FOLDER_PATH === undefined) {
  throw new Error("ERROR: You should define FOLDER_PATH");
}

export let csv_files: CSVFile[] = [];
setInterval(() => {
  csv_files = getCSVFilesInFolder(FOLDER_PATH);
}, 60000);

const server = new APIServer();
server.start();
