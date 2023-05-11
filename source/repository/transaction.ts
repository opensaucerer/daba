import TransactionModel from '../model/transaction';
import mongoose from 'mongoose';
import { ITransaction, TTransaction } from '../types/transaction';
import { Page } from '../types/generic';
import { Pager } from '../types/enum';
import * as func from '../helpers/func';

export const createTransaction = async (
  data: ITransaction,
  session?: mongoose.ClientSession,
): Promise<TTransaction> => {
  return (await new TransactionModel(data).save({ session })).populate({
    path: 'sender recipient',
    select: '-password',
  });
};

export const findByOwner = async (
  owner: mongoose.ObjectId,
): Promise<TTransaction | null> => {
  return await TransactionModel.findOne({ owner }).populate({
    path: 'sender recipient',
    select: '-password',
  });
};

export const findById = async (
  id: mongoose.ObjectId,
): Promise<TTransaction | null> => {
  return await TransactionModel.findOne({ _id: id }).populate({
    path: 'sender recipient',
    select: '-password',
  });
};

export const findByIdAndUpdate = async (
  id: mongoose.ObjectId,
  data:
    | ITransaction
    | Partial<Record<keyof ITransaction, any>>
    | mongoose.RootQuerySelector<ITransaction>
    | mongoose.UpdateQuery<ITransaction>,
  session?: mongoose.ClientSession,
): Promise<TTransaction | null> => {
  return await TransactionModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    session,
  }).populate({
    path: 'sender recipient',
    select: '-password',
  });
};

export const findOneByMatch = async (
  data:
    | ITransaction
    | Partial<Record<keyof ITransaction, any>>
    | mongoose.RootQuerySelector<ITransaction>
    | mongoose.UpdateQuery<ITransaction>,
): Promise<TTransaction | null> => {
  return await TransactionModel.findOne(data).populate({
    path: 'sender recipient',
    select: '-password',
  });
};

export const findAllByMatch = async (
  data:
    | ITransaction
    | Partial<Record<keyof ITransaction, any>>
    | mongoose.RootQuerySelector<ITransaction>
    | mongoose.UpdateQuery<ITransaction>,
  page: Page,
): Promise<TTransaction[] | null> => {
  return await TransactionModel.find(data)
    .sort({ updatedAt: func.sortDirection(page.sort!) || Pager.Sort })
    .skip(page.offset || Pager.Offset)
    .limit(page.limit || Pager.Limit)
    .populate({
      path: 'sender recipient',
      select: '-password',
    });
};
