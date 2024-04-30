import dotenv from 'dotenv';
dotenv.config();

interface Config {
  SERVER_PORT: number;
  PYTHON_SCRIPT_PATH: string;
  EXTERNAL_API_KEY: string;
}

const config: Config = {
  SERVER_PORT: parseInt(process.env.SERVER_PORT || '3000', 10),
  PYTHON_SCRIPT_PATH: process.env.PYTHON_SCRIPT_PATH || 'path/to/default/script.py',
  EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY || 'your-default-api-key',
};

export default config;