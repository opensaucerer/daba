import mongoose, { Schema, model } from 'mongoose';
import { TTransaction } from '../types/transaction';
import { createHash } from 'node:crypto';
import { TransactionType } from '../types/enum';
import bigDecimal from 'js-big-decimal';

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
      $type: mongoose.Types.Decimal128,
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
  {
    timestamps: true,
    typeKey: '$type',
    toJSON: {
      transform: function (doc, ret) {
        console.log(ret.amount);
        ret.id = ret._id;
        ret.amount = parseFloat(
          new bigDecimal(ret.amount)
            .round(2, bigDecimal.RoundingModes.DOWN)
            .getValue(),
        );
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        ret.amount = parseFloat(
          new bigDecimal(ret.amount)
            .round(2, bigDecimal.RoundingModes.DOWN)
            .getValue(),
        );
        return ret;
      },
    },
  },
);

export default model<TTransaction>('transaction', schema);
