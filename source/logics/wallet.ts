import { IAccount } from '../types/account';
import { MakeResponse, Page } from '../types/generic';
import * as response from '../helpers/response';
import * as walletRepository from '../repository/wallet';
import * as accountRepository from '../repository/account';
import * as transactionRepository from '../repository/transaction';
import { IDeposit, ITransaction, ITransfer } from '../types/transaction';
import mongoose from 'mongoose';
import { TransactionType } from '../types/enum';
import * as kafka from '../service/kafka';
import { logger } from '../log/logger';

export async function balance(payload: IAccount): Promise<MakeResponse> {
  try {
    const wallet = await walletRepository.findByOwner(payload._id!);
    if (!wallet) {
      return response.makeResponse(false, 'Something went wrong!', {});
    }
    return response.makeResponse(true, '', wallet.toJSON().balance);
  } catch (error: any) {
    return response.makeResponse(false, error.message, {});
  }
}

export async function deposit(payload: IDeposit): Promise<MakeResponse> {
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
          balance: new mongoose.Types.Decimal128(payload.amount.toString()),
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
        amount: new mongoose.Types.Decimal128(payload.amount.toString()),
        sender: payload.sender,
        type: TransactionType.Deposit,
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

    return response.makeResponse(true, '', transaction.toJSON());
  } catch (error: any) {
    await session.abortTransaction();
    return response.makeResponse(false, error.message, {});
  }
}

export async function transactions(
  payload: IAccount,
  page: Page,
): Promise<MakeResponse> {
  try {
    const txs = await transactionRepository.findAllByMatch(
      {
        $or: [{ sender: payload._id }, { recipient: payload._id }],
      },
      page,
    );
    return response.makeResponse(
      true,
      '',
      txs?.map((tx) => tx.toJSON()),
    );
  } catch (error: any) {
    return response.makeResponse(false, error.message, {});
  }
}

export async function transfer(payload: ITransfer): Promise<MakeResponse> {
  const session = await mongoose.connection.startSession();
  try {
    // verify the recipient
    const recipient = await accountRepository.findByEmail(payload.email);
    if (!recipient) {
      return response.makeResponse(false, 'Recipient not found!', {});
    }

    if (payload.sender.toString() === recipient._id!.toString()) {
      return response.makeResponse(
        false,
        'You cannot transfer to yourself!',
        {},
      );
    }

    let swallet = await walletRepository.findByOwner(payload.sender);
    if (!swallet) {
      return response.makeResponse(false, 'Something went wrong!', {});
    }

    const rwallet = await walletRepository.findByOwner(recipient._id!);
    if (!rwallet) {
      return response.makeResponse(false, 'Something went wrong!', {});
    }

    // Check if sender has enough balance
    if (
      swallet.balance < new mongoose.Types.Decimal128(payload.amount.toString())
    ) {
      return response.makeResponse(
        false,
        'Insufficient balance! Please try again.',
        {},
      );
    }

    session.startTransaction();

    swallet = await walletRepository.findByMatchAndUpdate(
      {
        _id: swallet._id!,
        balance: {
          $gte: new mongoose.Types.Decimal128(payload.amount.toString()),
        },
      },
      {
        $inc: {
          balance: new mongoose.Types.Decimal128((-payload.amount).toString()),
        },
      },
      session,
    );
    if (!swallet) {
      await session.abortTransaction();
      return response.makeResponse(
        false,
        'Transfer failed! Please try again.',
        {},
      );
    }

    const transaction = await transactionRepository.createTransaction(
      {
        amount: new mongoose.Types.Decimal128(payload.amount.toString()),
        sender: payload.sender,
        recipient: recipient._id,
        type: TransactionType.Transfer,
      },
      session,
    );

    if (!transaction) {
      await session.abortTransaction();
      return response.makeResponse(
        false,
        'Transfer failed! Please try again.',
        {},
      );
    }

    swallet = await walletRepository.findByMatchAndUpdate(
      { _id: rwallet._id! },
      {
        $inc: {
          balance: new mongoose.Types.Decimal128(payload.amount.toString()),
        },
      },
      session,
    );
    if (!swallet) {
      await session.abortTransaction();
      return response.makeResponse(
        false,
        'Transfer failed! Please try again.',
        {},
      );
    }

    await session.commitTransaction();

    kafka.consume('transfer', 'transfer', (message: string) => {
      const tx = JSON.parse(message);

      logger.info(
        `[${new Date().toISOString()}] [KAFKA] - Transfer of ${
          tx.amount
        } from ${tx.sender.name} to ${
          tx.recipient.name
        } completed at ${new Date(tx.timestamp).toISOString()}`,
      );
    });

    kafka.produce('transfer', JSON.stringify(transaction.toJSON()));

    return response.makeResponse(true, '', transaction.toJSON());
  } catch (error: any) {
    await session.abortTransaction();
    return response.makeResponse(false, error.message, {});
  }
}
