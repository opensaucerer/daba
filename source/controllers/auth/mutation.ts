import * as response from '../../helpers/response';
import { IAccount } from '../../types/account';
import * as authvalidator from '../../validator/auth';
import validate from '../../validator/validate';
import * as authlogic from '../../logics/auth';

export const register = async (_: unknown, data: IAccount, context: {}) => {
  const validation = validate(authvalidator.register, data);
  if (!validation.status) {
    return response.sendErrorResponse(validation.message, 400);
  }

  const logic = await authlogic.register(data);
  if (!logic.status) {
    return response.sendErrorResponse(logic.message, 400);
  }

  return logic.data;
};
