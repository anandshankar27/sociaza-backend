const joi = require("@hapi/joi")

// Registration Validator

const registrationValidator = (data) => {
    const Schema = joi.object({
        name: joi.string()
            .min(3)
            .required(),
        email: joi.string()
            .min(6)
            .email()
            .required(),
        password: joi.string()
            .min(8)
            .required()
    })
    const { error, value } = Schema.validate(data)
    return { error, value }
}

// Login Validator

const loginValidator = (data) => {
    const Schema = joi.object({
        email: joi.string()
            .min(6)
            .email()
            .required(),
        password: joi.string()
            .min(6)
            .required()
    })
    const { error, value } = Schema.validate(data)
    return { error, value }
}

module.exports.registrationValidator = registrationValidator
module.exports.loginValidator = loginValidator
