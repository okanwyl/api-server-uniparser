import APIServer from "./APIServer";
import dotenv from "dotenv";
import databaseSource from "./database";

dotenv.config();

(async () => {
  await databaseSource.initialize();

  const server = new APIServer();
  // server.config();
  server.start();
})();
