import authenticate from './authenticate';
import * as jwt from '../helpers/jwt';
import * as accountRepository from '../repository/account';
import * as bcrypt from '../helpers/bcrypt';
import { Request } from 'express';
import * as mongodb from '../database/mongodb';
import { IAccount } from '../types/account';

const user = {
  email: 'john@doe.com',
  name: 'John Doe',
  password: bcrypt.generateHashedPassword('password'),
};

describe('authenticate', () => {
  beforeEach(async () => {
    jest.setTimeout(1000 * 25);
    await mongodb.establishConnection();
  });

  afterEach(async () => {
    await accountRepository.cascadingDelete((user as IAccount)._id!);
  });

  it('should return an object containing the authenticated user', async () => {
    const account = await accountRepository.createAccount(user);
    (user as IAccount)._id = account._id;

    const token = jwt.signToken({ id: account._id });

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const result = await authenticate(req);

    expect(result).toEqual({ user: account });
  });

  it('should return an empty object if token is empty', async () => {
    const req = {
      headers: {
        authorization: '',
      },
    } as Request;

    const result = await authenticate(req);

    expect(result).toEqual({});
  });
  it('should throw a GraphQL error if token is invalid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    } as Request;

    expect(authenticate(req)).rejects.toThrowError();
  });
});
