import { IAccount } from './account';

export interface MakeResponse {
  status: number | boolean;
  message: string;
  data: Record<string, unknown>;
}

export interface Page {
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface IContext {
  user: IAccount;
}
