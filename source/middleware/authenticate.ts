import { Request } from 'express';
import * as jwt from '../helpers/jwt';
import { GraphQLError } from 'graphql';
import { HttpStatus } from '../types/enum';
import * as accountRepository from '../repository/account';
import mongoose from 'mongoose';
import * as response from '../helpers/response';

export default async (req: Request) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ') ||
    !req.headers.authorization.split(' ')[1] ||
    !req.headers.authorization.split(' ')[1].length
  ) {
    return {};
  }
  const token = req.headers.authorization!.split(' ')[1];
  if (token) {
    let verified = await jwt.verifyToken(token);
    if (verified.status) {
      const account = await accountRepository.findById(
        verified.data['id'] as mongoose.ObjectId,
      );
      if (!account) {
        return response.sendErrorResponse('Login failed!', 403);
      }
      return { user: account.jsonify() };
    }
    return response.sendErrorResponse(verified.message, 401);
  }
  return {};
};
