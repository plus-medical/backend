const joi = require('@hapi/joi');

const usernameSchema = joi.string().regex(/^(.)*\.(.)*\.(\d){4}$/);
const passwordSchema = joi.string();

const roleSchema = joi.string().regex(/^((administrator)|(doctor)|(patient)|(lab-worker))$/);
const documentTypeSchema = joi.string().regex(/^((CC)|(TI)|(CE)|(RC)|(PA)|(CD))$/);
const documentSchema = joi.number();
const nameSchema = joi.object({
  first: joi.string().required(),
  last: joi.string().required(),
});
const emailSchema = joi.string().email();
const birthdateSchema = joi.date();
const genderSchema = joi.string().regex(/^((F)|(M))$/);
const addressSchema = joi.object({
  street: joi.string(),
  city: joi.string(),
  state: joi.string(),
  zip: joi.number(),
});
const phoneSchema = joi.string();
const photoSchema = joi.string().uri();

const signinSchema = {
  username: usernameSchema.required(),
  password: passwordSchema.required(),
};

const createUserSchema = {
  role: roleSchema.required(),
  documentType: documentTypeSchema.required(),
  document: documentSchema.required(),
  name: nameSchema.required(),
  email: emailSchema.required(),
  birthdate: birthdateSchema,
  gender: genderSchema,
  address: addressSchema,
  phone: phoneSchema,
  photo: photoSchema,
};

module.exports = {
  signinSchema,
  createUserSchema,
};
