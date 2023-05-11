import { gql } from 'apollo-server-core';
import authdef from '../controllers/auth/type';
import accountdef from '../controllers/account/type';

export default gql(accountdef + authdef);
