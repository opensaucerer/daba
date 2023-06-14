import { IAccount } from '../types/account';
import { MakeResponse } from '../types/generic';
import * as response from '../helpers/response';
import * as accountRepository from '../repository/account';
import * as walletRepository from '../repository/wallet';
import * as bcrypt from '../helpers/bcrypt';
import mongoose from 'mongoose';
import * as jwt from '../helpers/jwt';

export async function register(payload: IAccount): Promise<MakeResponse> {
  const session = await mongoose.connection.startSession();

  try {
    const existingAccount = await accountRepository.findByEmail(
      payload.email.toLowerCase(),
    );
    if (existingAccount) {
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
    account.set('password', undefined);

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

export async function login(payload: IAccount): Promise<MakeResponse> {
  try {
    const account = await accountRepository.findByEmail(
      payload.email.toLowerCase(),
    );
    if (!account) {
      return response.makeResponse(false, 'Invalid login credentials!', {});
    }

    if (!bcrypt.compareHashedPassword(payload.password, account.password)) {
      return response.makeResponse(false, 'Invalid login credentials!', {});
    }

    account.set('password', undefined);

    return response.makeResponse(true, '', {
      account: account,
      token: jwt.signToken({ id: account._id }),
    });
  } catch (error: any) {
    return response.makeResponse(false, error.message, {});
  }
}
