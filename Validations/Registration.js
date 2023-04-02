import {body} from 'express-validator';

export const registrationValidator = [
    body('email', "Wrong format, example: user1@gmail.com").isEmail(),
    body('role', "Wrong role, customer or manager expected").isString().isIn(['customer', 'manager']),
    body('password', "Password should be at least 5 characters length").isLength({min: 5}),
    body('fullName', "Name should be at least 3 characters length").isLength({min: 3}),
    body('avatar', "Avatar should be an URL" ).optional().isURL(),

]