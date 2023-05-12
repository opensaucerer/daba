import Joi from 'joi';

export const transactions = Joi.object({
  limit: Joi.number(),
  offset: Joi.number(),
  sort: Joi.string().valid('asc', 'desc'),
}).required();

export const deposit = Joi.object({
  amount: Joi.number().required(),
}).required();

export const transfer = Joi.object({
  amount: Joi.number().required(),
  email: Joi.string().email().required(),
}).required();
