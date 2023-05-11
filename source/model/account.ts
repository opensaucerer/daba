import { Schema, model } from 'mongoose';
import * as func from '../helpers/func';
import { TAccount } from '../types/account';

export default model<TAccount>(
  'account',
  new Schema<TAccount>(
    {
      email: {
        $type: String,
        required: true,
        lowercase: true,
        unique: true, // creates a unique index
      },
      password: {
        $type: String,
        required: true,
      },
      name: {
        $type: String,
        set: func.firstCharToUpperCase,
      },
    },
    { timestamps: true, typeKey: '$type' },
  ),
);
