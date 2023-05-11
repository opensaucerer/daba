import { MakeResponse } from '../types/generic';
import { GraphQLError } from 'graphql';
import { ValidationError } from 'joi';
import { HttpStatus, StatusForCode } from '../types/enum';

export const makeResponse = (
  status: number | boolean,
  message: string,
  data: Record<string, any>,
): MakeResponse => {
  return {
    status,
    message,
    data,
  };
};

export const sendErrorResponse = (
  message: string,
  code: number = 400,
): GraphQLError => {
  throw new GraphQLError(message, {
    extensions: {
      code: StatusForCode[400] || HttpStatus.BadRequest,
      http: { status: code },
    },
  });
};

export const handleValidationError = (
  validateErrorData: ValidationError,
): GraphQLError => {
  return sendErrorResponse(validateErrorData.details[0].message, 400);
};
