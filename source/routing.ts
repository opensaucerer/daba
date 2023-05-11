import { Application, Request, Response } from 'express';
import * as logger from './log/logger';

export default function handleRouting(app: Application): void {
  // 404 Error Handler
  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({
      status: false,
      error: 'And Just Like That, You Completely Lost Your Way 😥',
    });
  });

  // Error Handler
  app.use((error: Error) => {
    logger.logErrorToConsole(error);
  });
}
