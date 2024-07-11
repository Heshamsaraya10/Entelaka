import Joi from "joi";

export const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  position: Joi.string().required(),
  // photo: Joi.string().uri().optional(),
  description: Joi.string().optional(),
});

export default userSchema;
