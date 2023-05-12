import * as response from '../../helpers/response';
import * as walletlogic from '../../logics/wallet';
import { IContext, Page } from '../../types/generic';
import * as transactionvalidator from '../../validator/transaction';
import validate from '../../validator/validate';

export const balance = async (_: unknown, data: Page, context: IContext) => {
  if (!context.user) {
    return response.sendErrorResponse('Login required!', 401);
  }
  const logic = await walletlogic.balance(context.user);
  if (!logic.status) {
    return response.sendErrorResponse(logic.message, 400);
  }
  return logic.data;
};

export const transactions = async (
  _: unknown,
  data: Page,
  context: IContext,
) => {
  if (!context.user) {
    return response.sendErrorResponse('Login required!', 401);
  }
  const validation = validate(transactionvalidator.transactions, data);
  if (!validation.status) {
    return response.sendErrorResponse(validation.message, 400);
  }
  const logic = await walletlogic.transactions(context.user, data);
  if (!logic.status) {
    return response.sendErrorResponse(logic.message, 400);
  }
  return logic.data;
};
