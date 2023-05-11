import * as response from '../../helpers/response';
import * as accountlogic from '../../logics/account';
import { IContext } from '../../types/generic';

export const account = async (_: unknown, data: {}, context: IContext) => {
  if (!context.user) {
    return response.sendErrorResponse('Login required!', 401);
  }
  const logic = await accountlogic.account(context.user);
  if (!logic.status) {
    return response.sendErrorResponse(logic.message, 400);
  }
  return logic.data;
};
