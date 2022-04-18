import joi from "joi"


export const validation = joi.object({
     name: joi.string().min(3).max(25).trim(true).required(),
     email: joi.string().lowercase().email().pattern(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)).trim(true).required(),
     pass: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).trim(true).required(),
     activateUserByMail: joi.string().default('Pending'),
     isUserOnline: joi.boolean().default(false),
});



