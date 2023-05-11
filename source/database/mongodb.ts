import { connect } from 'mongoose';
import env from '../config/env';

export function establishConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    connect(env.database.mongodb.uri)
      .then(() => {
        resolve(console.log('DB Connected'));
      })
      .catch((error: Error) => {
        reject(console.log('DB Connection Error: ', error));
      });
  });
}
