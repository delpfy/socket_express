import {body} from 'express-validator';

export const authorizationValidator = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),

]