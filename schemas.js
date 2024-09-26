const Joi = require('joi');

module.exports.spotSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    cost: Joi.number().min(0).required(),
    description: Joi.string().required(),
    images: Joi.string(),
    deleteImages: Joi.array()
});

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required()
});

module.exports.reviewSchema = Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required()
});