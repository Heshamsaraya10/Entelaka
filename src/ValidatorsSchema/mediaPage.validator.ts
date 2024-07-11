import Joi from "joi";

export const mediaPageSchema = Joi.object({
  header: Joi.object({
    images: Joi.array().items(Joi.string()).required(),
    text: Joi.string().required(),
  }).required(),

  event: Joi.object({
    images: Joi.string().required(),
    h1: Joi.string().required(),
    h2: Joi.string().required(),
  }).required(),

  Gallery: Joi.object({
    image: Joi.string().required(),
    title: Joi.string().required(),
    date: Joi.date().required(),
  }).required(),
  Videos: Joi.object({
    vedio: Joi.string().required(),
    title: Joi.string().required(),
  }).required(),
});


export default mediaPageSchema