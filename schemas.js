const Joi = require('joi');

module.exports.spotSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    cost: Joi.number().required(),
    imageURL: Joi.string().required()
});