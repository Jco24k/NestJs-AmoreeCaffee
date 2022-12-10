import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    DB_HOST: Joi.required(),
    DB_USERNAME: Joi.required(),
    DB_PASSWORD: Joi.required(),
    DB_PORT: Joi.required(),
    DB_NAME: Joi.required(),
    UPLOAD_LOCATION: Joi.required(),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(10),
    JWT_SECRET: Joi.required() 

}) 