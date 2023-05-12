import mongoose, { Schema, model } from 'mongoose';
import { TTransaction } from '../types/transaction';
import { createHash } from 'node:crypto';
import { TransactionType } from '../types/enum';

const schema = new Schema<TTransaction>(
  {
    session: {
      $type: String,
      required: true,
      default: function (_: string) {
        const t = this as TTransaction;
        return createHash('sha1')
          .update(
            process.hrtime.bigint().toString() +
              t.sender!.toString() +
              t.amount!.toString() +
              (t.recipient || '')?.toString(),
          )
          .digest('hex')
          .toUpperCase();
      },
    },
    sender: {
      $type: mongoose.Schema.Types.ObjectId,
      ref: 'account',
      required: true,
    },
    recipient: {
      $type: mongoose.Schema.Types.ObjectId,
      ref: 'account',
    },
    amount: {
      $type: Number,
      required: true,
    },
    timestamp: {
      $type: Number,
      required: true,
      default: Date.now,
    },
    type: {
      $type: String,
      enum: TransactionType,
      required: true,
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
  const t = this.toJSON();
  if (t.sender) {
    t.sender = {
      id: t.sender._id,
      ...t.sender,
    };
  }
  if (t.recipient) {
    t.recipient = {
      id: t.recipient._id,
      ...t.recipient,
    };
  }
  return {
    id: this._id,
    ...t,
  };
};

export default model<TTransaction>('transaction', schema);
