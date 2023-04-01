import {body} from 'express-validator'

export const addingItemValidator = [
    body('name', "Name should not be an number").isString(),
    body('description', "Description should not be an number").isString(),
    body('price', "Price should not be an string").isNumeric(),
    body('rating', "Rating should not be an string").isNumeric(),
    body('image', "More than one image required").isArray(),
]