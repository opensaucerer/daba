import { connect, connection } from 'mongoose';
import env from '../config/env';
import { logger } from '../log/logger';

export function establishConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    subscribeToConnectionEvents();
    connect(env.database.mongodb.uri)
      .then(() => {
        resolve();
      })
      .catch((error: Error) => {
        reject(console.log('DB Connection Error: ', error));
      });
  });
}

export function subscribeToConnectionEvents(): void {
  connection.on('connected', () => {
    logger.info('Mongoose connected to ' + env.database.mongodb.name);
  });
  connection.on('error', async (error) => {
    logger.error('Mongoose connection error: ' + error);
    await establishConnection();
  });
  connection.on('disconnected', async () => {
    logger.warn('Mongoose disconnected');
    await establishConnection();
  });
}

export function closeConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    connection
      .close()
      .then(() => {
        resolve();
      })
      .catch((error: Error) => {
        reject(console.log('DB Connection Error: ', error));
      });
  });
}
