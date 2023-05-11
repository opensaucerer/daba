import AccountModel from '../model/account';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { IAccount, TAccount } from '../types/account';
import { Page } from '../types/generic';
import { Pager } from '../types/enum';
import * as func from '../helpers/func';

export const createAccount = async (
  data: IAccount,
  session?: mongoose.ClientSession,
): Promise<HydratedDocument<IAccount>> => {
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
