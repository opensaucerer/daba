import mongoose from 'mongoose';
import { IAccount } from './account';

export interface IWallet {
  _id?: mongoose.Types.ObjectId;
  currency?: string;
  owner: mongoose.Types.ObjectId | IAccount;
  balance?: number;
}

export type TWallet = mongoose.Document & IWallet;
