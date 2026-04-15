import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  DB:string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  DB:process.env.DB_LOCAL || ""
};


export default config