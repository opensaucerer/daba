import * as accountquery from './account/query';
import * as accountmutation from './account/mutation';
import * as walletquery from './wallet/query';
import * as walletmutation from './wallet/mutation';

export default {
  Query: {
    ...accountquery,
    ...walletquery,
  },
  Mutation: {
    ...accountmutation,
    ...walletmutation,
  },
};
