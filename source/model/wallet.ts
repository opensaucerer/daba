import mongoose, { Schema, model } from 'mongoose';
import { TWallet } from '../types/wallet';
import { Currency } from '../types/enum';

const schema = new Schema<TWallet>(
  {
    currency: {
      $type: String,
      required: true,
      lowercase: true,
      default: Currency.NGN,
    },
    owner: {
      $type: mongoose.Schema.Types.ObjectId,
      ref: 'account',
      required: true,
    },
    balance: {
      $type: Number,
      required: true,
      default: 0,
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

export default model<TWallet>('wallet', schema);
