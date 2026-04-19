import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

interface Config {
  port: number;
  DB: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

// const config: Config = {
//   port: Number(process.env.PORT) || 3000,
//   DB: process.env.DB_LOCAL || "",
//   JWT_SECRET: process.env.JWT_SECRET || "",
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",
// };

const config = Object.freeze({
  app: {
    port: Number(process.env.PORT) || 3000,
  },
  db: { db_string: process.env.DB_LOCAL || "" },
  auth: {
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",
  },
  redis: {
    uri: "",
  },
});
export default config;
