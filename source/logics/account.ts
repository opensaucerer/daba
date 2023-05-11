import { IAccount } from '../types/account';
import { MakeResponse } from '../types/generic';
import * as response from '../helpers/response';
import * as accountRepository from '../repository/account';

export async function account(payload: IAccount): Promise<MakeResponse> {
  try {
    const account = await accountRepository.findById(payload._id!);
    if (!account) {
      return response.makeResponse(false, 'Login required!', {});
    }

    account.set('password', undefined);

    return response.makeResponse(true, '', account.jsonify());
  } catch (error: any) {
    return response.makeResponse(false, error.message, {});
  }
}
