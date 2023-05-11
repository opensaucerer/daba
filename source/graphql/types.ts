import { gql } from 'apollo-server-core';
import accountdef from '../controllers/account/type';
import walletdef from '../controllers/wallet/type';

export default gql(walletdef + accountdef);
