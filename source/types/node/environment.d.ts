declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_SECRET: string;
      APP_NAME: string;
      PORT: number;
      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DEPLOYMENT_ENV: string;
      JWT_EXPIRY: string;
    }
  }
}

export {};
