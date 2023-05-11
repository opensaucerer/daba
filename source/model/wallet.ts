import mongoose, { Schema, model } from 'mongoose';
import { TWallet } from '../types/wallet';
import { Currency } from '../types/enum';

export default model<TWallet>(
  'wallet',
  new Schema<TWallet>(
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
  ),
);
