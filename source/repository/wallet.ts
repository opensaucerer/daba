import WalletModel from '../model/wallet';
import mongoose from 'mongoose';
import { IWallet, TWallet } from '../types/wallet';
import { Page } from '../types/generic';
import { Pager } from '../types/enum';
import * as func from '../helpers/func';

export const createWallet = async (
  data: IWallet,
  session?: mongoose.ClientSession,
): Promise<TWallet> => {
  return await new WalletModel(data).save({ session });
};

export const findByOwner = async (
  owner: mongoose.ObjectId,
): Promise<TWallet | null> => {
  return await WalletModel.findOne({ owner });
};

export const findById = async (
  id: mongoose.ObjectId,
): Promise<TWallet | null> => {
  return await WalletModel.findOne({ _id: id });
};

export const findByMatchAndUpdate = async (
  match:
    | IWallet
    | Partial<Record<keyof IWallet, any>>
    | mongoose.RootQuerySelector<IWallet>
    | mongoose.UpdateQuery<IWallet>,
  data:
    | IWallet
    | Partial<Record<keyof IWallet, any>>
    | mongoose.RootQuerySelector<IWallet>
    | mongoose.UpdateQuery<IWallet>,
  session?: mongoose.ClientSession,
): Promise<TWallet | null> => {
  return await WalletModel.findOneAndUpdate(match, data, {
    new: true,
    session,
  });
};

export const findByIdAndUpdate = async (
  id: mongoose.ObjectId,
  data:
    | IWallet
    | Partial<Record<keyof IWallet, any>>
    | mongoose.RootQuerySelector<IWallet>
    | mongoose.UpdateQuery<IWallet>,
  session?: mongoose.ClientSession,
): Promise<TWallet | null> => {
  return await WalletModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    session,
  });
};

export const findOneByMatch = async (
  data:
    | IWallet
    | Partial<Record<keyof IWallet, any>>
    | mongoose.RootQuerySelector<IWallet>
    | mongoose.UpdateQuery<IWallet>,
): Promise<TWallet | null> => {
  return await WalletModel.findOne(data);
};

export const findAllByMatch = async (
  data:
    | IWallet
    | Partial<Record<keyof IWallet, any>>
    | mongoose.RootQuerySelector<IWallet>
    | mongoose.UpdateQuery<IWallet>,
  page: Page,
): Promise<TWallet[] | null> => {
  return await WalletModel.find(data)
    .sort({ updatedAt: func.sortDirection(page.sort!) || Pager.Sort })
    .skip(page.offset || Pager.Offset)
    .limit(page.limit || Pager.Limit);
};
