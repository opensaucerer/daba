import mongoose from 'mongoose';
import { IAccount } from './account';

export interface IWallet {
  _id?: mongoose.ObjectId;
  currency?: string;
  owner: mongoose.ObjectId | IAccount;
  balance: number;
}

export type TWallet = mongoose.Document &
  IWallet & {
    jsonify(): Record<string, any>;
  };
