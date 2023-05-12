import * as response from '../../helpers/response';
import * as walletlogic from '../../logics/wallet';
import { IContext } from '../../types/generic';
import { IDeposit, ITransaction, ITransfer } from '../../types/transaction';
import validate from '../../validator/validate';
import * as transactionvalidator from '../../validator/transaction';

export const deposit = async (
  _: unknown,
  data: IDeposit,
  context: IContext,
) => {
  if (!context.user) {
    return response.sendErrorResponse('Login required!', 401);
  }
  const validation = validate(transactionvalidator.deposit, data);
  if (!validation.status) {
    return response.sendErrorResponse(validation.message, 400);
  }
  const logic = await walletlogic.deposit({
    sender: context.user._id!,
    amount: data.amount,
  });
  if (!logic.status) {
    return response.sendErrorResponse(logic.message, 400);
  }
  return logic.data;
};

export const transfer = async (
  _: unknown,
  data: ITransfer,
  context: IContext,
) => {
  if (!context.user) {
    return response.sendErrorResponse('Login required!', 401);
  }
  const validation = validate(transactionvalidator.transfer, data);
  if (!validation.status) {
    return response.sendErrorResponse(validation.message, 400);
  }
  const logic = await walletlogic.transfer({
    ...data,
    sender: context.user._id!,
  });
  if (!logic.status) {
    return response.sendErrorResponse(logic.message, 400);
  }
  return logic.data;
};
