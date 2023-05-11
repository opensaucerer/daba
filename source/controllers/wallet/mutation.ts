import * as response from '../../helpers/response';
import * as walletlogic from '../../logics/wallet';
import { IContext } from '../../types/generic';
import { ITransaction } from '../../types/transaction';

export const deposit = async (
  _: unknown,
  data: ITransaction,
  context: IContext,
) => {
  if (!context.user) {
    return response.sendErrorResponse('Login required!', 401);
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
