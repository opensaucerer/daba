import mongoose from 'mongoose';
import { IAccount } from './account';

export interface ITransaction {
  _id?: mongoose.ObjectId;
  sender?: mongoose.ObjectId | IAccount;
  recipient?: mongoose.ObjectId | IAccount;
  amount: number;
  timestamp?: string;
  session?: string;
}

export type TTransaction = mongoose.Document &
  ITransaction & {
    jsonify(): Record<string, any>;
  };
