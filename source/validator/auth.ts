import Joi from 'joi';

export const register = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#.?&])[A-Za-z\d@$!%*#?.&]{8,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one number, one letter and one special character',
      'string.min': 'Password must be at least 8 characters long',
    }),
}).required();

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();
