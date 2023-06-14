import mongoose from 'mongoose';
import { IAccount } from './account';

export interface IWallet {
  _id?: mongoose.ObjectId;
  currency?: string;
  owner: mongoose.ObjectId | IAccount;
  balance: mongoose.Types.Decimal128 | number;
}

export type TWallet = mongoose.Document & IWallet;
