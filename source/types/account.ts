import mongoose from 'mongoose';

export interface IAccount {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

export type TAccount = mongoose.Document & IAccount;
