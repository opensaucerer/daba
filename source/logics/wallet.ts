import { IAccount } from '../types/account';
import { MakeResponse } from '../types/generic';
import * as response from '../helpers/response';
import * as walletRepository from '../repository/wallet';

export async function balance(payload: IAccount): Promise<MakeResponse> {
  try {
    const account = await walletRepository.findByOwner(payload._id!);

    return response.makeResponse(true, '', account?.balance);
  } catch (error: any) {
    return response.makeResponse(false, error.message, {});
  }
}
