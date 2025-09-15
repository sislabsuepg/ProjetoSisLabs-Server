import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  host: string;
  username: string;
  password: string;
  database: string;
  db_port: number;
  secret: string;
  expires: string;
}

const config: Config = {
  port: Number(process.env.APP_PORT) || 3400,
  nodeEnv: process.env.NODE_ENV || "dev",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB || "sislabs",
  db_port: Number(process.env.DB_PORT) || 5432,
  secret: process.env.SECRET || "Default",
  expires: process.env.EXPIRES_IN || "28800",
};

export default config;
