const joi = require("@hapi/joi")
const { options } = require("@hapi/joi")

// Registration Validator

const registrationValidator = (data) => {
    const Schema = joi.object({
        name: joi.string()
            .min(3)
            .max(30)
            .required(),
        email: joi.string()
            .min(6)
            .max(30)
            .email()
            .required(),
        username: joi.string()
            .regex(/^[a-zA-Z0-9_]{3,25}$/),
        password: joi.string()
            .min(8)
            .max(30)
            .required()
    })
    const { error, value } = Schema.validate(data, { abortEarly: false })
    return { error, value }
}

// Login Validator

const loginValidator = (data) => {
    const Schema = joi.object({
        email: joi.string()
            .min(6)
            .max(30)
            .email()
            .required(),
        password: joi.string()
            .min(8)
            .max(30)
            .required()
    })
    const { error, value } = Schema.validate(data, { abortEarly: false })
    return { error, value }
}

// Post Validator

const postValidator = (data) => {
    const Schema = joi.object({
        caption: joi.string()
            .min(1)
            .max(200),
        media: joi.allow()
    })
    const { error, value } = Schema.validate(data)
    return { error, value }
}

module.exports.registrationValidator = registrationValidator
module.exports.loginValidator = loginValidator
module.exports.postValidator = postValidator