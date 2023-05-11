import { IAccount } from '../types/account';
import { MakeResponse } from '../types/generic';
import * as response from '../helpers/response';
import * as walletRepository from '../repository/wallet';
import * as transactionRepository from '../repository/transaction';
import { ITransaction } from '../types/transaction';
import mongoose from 'mongoose';
import transaction from '../model/transaction';

export async function balance(payload: IAccount): Promise<MakeResponse> {
  try {
    const wallet = await walletRepository.findByOwner(payload._id!);
    if (!wallet) {
      return response.makeResponse(false, 'Something went wrong!', {});
    }

    return response.makeResponse(true, '', wallet?.balance);
  } catch (error: any) {
    return response.makeResponse(false, error.message, {});
  }
}

export async function deposit(payload: ITransaction): Promise<MakeResponse> {
  const session = await mongoose.connection.startSession();
  try {
    let wallet = await walletRepository.findByOwner(
      payload.sender as mongoose.ObjectId,
    );
    if (!wallet) {
      return response.makeResponse(false, 'Something went wrong!', {});
    }

    session.startTransaction();

    wallet = await walletRepository.findByIdAndUpdate(
      wallet._id!,
      {
        $inc: {
          balance: payload.amount,
        },
      },
      session,
    );
    if (!wallet) {
      await session.abortTransaction();
      return response.makeResponse(
        false,
        'Deposit failed! Please try again.',
        {},
      );
    }

    const transaction = await transactionRepository.createTransaction(
      {
        amount: payload.amount,
        sender: payload.sender,
      },
      session,
    );

    if (!transaction) {
      await session.abortTransaction();
      return response.makeResponse(
        false,
        'Deposit failed! Please try again.',
        {},
      );
    }

    await session.commitTransaction();

    return response.makeResponse(true, '', transaction.jsonify());
  } catch (error: any) {
    await session.abortTransaction();
    return response.makeResponse(false, error.message, {});
  }
}
