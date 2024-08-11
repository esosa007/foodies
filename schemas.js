const Joi = require('joi');

module.exports.spotSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    cost: Joi.number().min(0).required(),
    description: Joi.string().min(10).required(),
    imageURL: Joi.string().required()
});

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required()
})