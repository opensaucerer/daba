import mongoose, { Schema, model } from 'mongoose';
import { TWallet } from '../types/wallet';
import { Currency } from '../types/enum';
import bigDecimal from 'js-big-decimal';

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
      $type: mongoose.Types.Decimal128,
      required: true,
      default: new mongoose.Types.Decimal128('0'),
    },
  },
  {
    timestamps: true,
    typeKey: '$type',
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        ret.balance = parseFloat(
          new bigDecimal(ret.balance)
            .round(2, bigDecimal.RoundingModes.DOWN)
            .getValue(),
        );
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        ret.balance = parseFloat(
          new bigDecimal(ret.balance)
            .round(2, bigDecimal.RoundingModes.DOWN)
            .getValue(),
        );
        return ret;
      },
    },
  },
);

export default model<TWallet>('wallet', schema);
