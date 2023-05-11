import * as response from '../../helpers/response';
import * as walletlogic from '../../logics/wallet';
import { IContext } from '../../types/generic';

export const deposit = async (_: unknown, data: {}, context: IContext) => {
  if (!context.user) {
    return response.sendErrorResponse('Login required!', 401);
  }
  const logic = await walletlogic.balance(context.user);
  if (!logic.status) {
    return response.sendErrorResponse(logic.message, 400);
  }
  return logic.data;
};
