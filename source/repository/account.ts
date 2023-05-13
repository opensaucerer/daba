import AccountModel from '../model/account';
import WalletModel from '../model/wallet';
import TransactionModel from '../model/transaction';
import mongoose from 'mongoose';
import { IAccount, TAccount } from '../types/account';
import { Page } from '../types/generic';
import { Pager } from '../types/enum';
import * as func from '../helpers/func';

export const createAccount = async (
  data: IAccount,
  session?: mongoose.ClientSession,
): Promise<TAccount> => {
  return await new AccountModel(data).save({ session });
};

export const findByEmail = async (email: string): Promise<TAccount | null> => {
  return await AccountModel.findOne({ email });
};

export const findById = async (
  id: mongoose.ObjectId,
): Promise<TAccount | null> => {
  return await AccountModel.findOne({ _id: id });
};

export const findByIdAndUpdate = async (
  id: mongoose.ObjectId,
  data:
    | IAccount
    | Partial<Record<keyof IAccount, any>>
    | mongoose.RootQuerySelector<IAccount>
    | mongoose.UpdateQuery<IAccount>,
  session?: mongoose.ClientSession,
): Promise<TAccount | null> => {
  return await AccountModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    session,
  });
};

export const findOneByMatch = async (
  data:
    | IAccount
    | Partial<Record<keyof IAccount, any>>
    | mongoose.RootQuerySelector<IAccount>
    | mongoose.UpdateQuery<IAccount>,
): Promise<TAccount | null> => {
  return await AccountModel.findOne(data);
};

export const findAllByMatch = async (
  data:
    | IAccount
    | Partial<Record<keyof IAccount, any>>
    | mongoose.RootQuerySelector<IAccount>
    | mongoose.UpdateQuery<IAccount>,
  page: Page,
): Promise<TAccount[] | null> => {
  return await AccountModel.find(data)
    .sort({ updatedAt: func.sortDirection(page.sort!) || Pager.Sort })
    .skip(page.offset || Pager.Offset)
    .limit(page.limit || Pager.Limit);
};

export const cascadingDelete = async (
  id: mongoose.ObjectId,
  session?: mongoose.ClientSession,
): Promise<boolean> => {
  // find account
  const account = await findById(id);
  if (!account) {
    return false;
  }
  // delete wallet
  await WalletModel.deleteMany({ owner: id }, { session });
  // delete all user created transactions
  await TransactionModel.deleteMany({ sender: id }, { session });
  // delete account
  account.deleteOne({ session });
  return true;
};
