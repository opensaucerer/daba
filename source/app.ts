import runApplication from './server';
import express, { Application } from 'express';

const app: Application = express();

runApplication(app);
