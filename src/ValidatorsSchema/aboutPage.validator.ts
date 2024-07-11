import Joi from "joi";

export const aboutPageSchema = Joi.object({
  header: Joi.object({
    images: Joi.array().items(Joi.string()).required(),
    text: Joi.string().required(),
  }).required(),
  description: Joi.string().optional(),
  footer: Joi.array()
    .items(
      Joi.object({
        aboutUs: Joi.array().items(Joi.string()).required(),
        Accelerator: Joi.array().items(Joi.string()).required(),
        ThinkTank: Joi.array().items(Joi.string()).required(),
        Projects: Joi.array().items(Joi.string()).required(),
        MediaCenter: Joi.array().items(Joi.string()).required(),
        ContactUs: Joi.array().items(Joi.string()).required(),
        socialMedia: Joi.string().required(),
      })
    )
    .optional(),

  userId: Joi.number().integer().positive().required(),
});


export default aboutPageSchema