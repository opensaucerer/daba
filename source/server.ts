import env from './config/env';
import { logan, logger } from './log/logger';
import express, { Application } from 'express';
import * as mongodb from './database/mongodb';
import buildGraphQLServer from './graphql';
import handleRouting from './routing';
import cors from 'cors';

export default async function startApplication(
  app: Application,
): Promise<void> {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.raw());
  app.use(cors());

  app.use(logan);

  await mongodb.establishConnection();

  const frame = await buildGraphQLServer(app);

  frame.http.listen(env.port, async () => {
    logger.info(`All connections established successfully.`);
    logger.info(`REST at: http://localhost:${env.port}`);
    logger.info(`GraphQL at: http://localhost:${env.port}/pivot/graphql`);
  });

  handleRouting(app);
}
