import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.APP_PORT) || 3400,
  nodeEnv: process.env.NODE_ENV || 'dev',
};

export default config;