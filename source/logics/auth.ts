import { IAccount } from '../types/account';
import { MakeResponse } from '../types/generic';
import * as response from '../helpers/response';
import * as accountRepository from '../repository/account';
import * as walletRepository from '../repository/wallet';
import * as bcrypt from '../helpers/bcrypt';
import mongoose from 'mongoose';

export async function register(payload: IAccount): Promise<MakeResponse> {
  const session = await mongoose.connection.startSession();

  try {
    const existingUser = await accountRepository.findByEmail(
      payload.email.toLowerCase(),
    );
    if (existingUser) {
      return response.makeResponse(false, 'Email already in use!', {});
    }

    session.startTransaction();

    // create user account
    const account = await accountRepository.createAccount(
      {
        password: bcrypt.generateHashedPassword(payload.password),
        email: payload.email.toLowerCase(),
        name: payload.name,
      },
      session,
    );
    if (!account) {
      await session.abortTransaction();
      return response.makeResponse(false, 'Account creation failed!', {});
    }
    account.password = '';

    // create user wallet
    const wallet = await walletRepository.createWallet(
      {
        owner: account._id,
        balance: 0,
      },
      session,
    );
    if (!wallet) {
      await session.abortTransaction();
      return response.makeResponse(false, 'Wallet creation failed!', {});
    }

    await session.commitTransaction();

    return response.makeResponse(true, '', account);
  } catch (error: any) {
    await session.abortTransaction();
    return response.makeResponse(false, error.message, {});
  }
}
