import { Request } from 'express';
import * as jwt from '../helpers/jwt';
import { GraphQLError } from 'graphql';
import { HttpStatus } from '../types/enum';

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
      // TODO: check user's existence
      return { user: verified.data };
    }

    throw new GraphQLError(verified.message, {
      extensions: {
        code: HttpStatus.Unauthenticaed,
        http: { status: 401 },
      },
    });
  }
  return {};
};
