import { config } from 'dotenv';
config();

export default {
  name: process.env.APP_NAME || 'Daba',
  jwt: {
    secret: process.env.APP_SECRET || 'insecure@1bug.com',
    expiry: process.env.JWT_EXPIRY || '1d',
  },
  port: Number(process.env.PORT) || 3000,
  deploymentEnv: process.env.DEPLOYMENT_ENV || 'development',
  database: {
    mongodb: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 27017,
      name: process.env.DB_NAME || 'daba',
      user: process.env.DB_USER || 'daba',
      password: process.env.DB_PASSWORD || 'password',
      uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&authSource=admin`,
    },
  },
};
