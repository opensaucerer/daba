import { Schema, model } from 'mongoose';
import * as func from '../helpers/func';
import { TAccount } from '../types/account';

const schema = new Schema<TAccount>(
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
);

/**
 * Returns a json object of the wallet
 * @param
 * @returns {Record<string, any>}
 *
 */
schema.methods.jsonify = function (): Record<string, any> {
  return {
    id: this._id,
    ...this.toJSON(),
  };
};

export default model<TAccount>('account', schema);
