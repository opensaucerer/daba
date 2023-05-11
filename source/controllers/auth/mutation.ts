import { IAccount } from '../../types/account';

export const register = async (_: unknown, data: IAccount, context: {}) => {
  return {
    ...data,
    id: '',
  };
};
