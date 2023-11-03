import { body, validationResult } from "express-validator";

const userRegisterValidations = () => {
    return [
        body("firstName", "First Name is required &&  > 2 char").isLength({ min: 2, max: 15 }),

        body("lastName", "Last Name is Required").notEmpty().isLength({ min: 2, max: 15 }).withMessage("Length should be <2 and >15"),

        body("email", "Should be a Valid Email").isEmail(),

        body("phone", "Should be a Valid Phone Number").isMobilePhone(),

        body("password", "Should be a Strong Password").isStrongPassword().isLength({ min: 8, max: 16 }),


        body("address", "Address is Required").isLength({ min: 5, max: 100 })
    ]
}
const errorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }

    return next()
}

export { userRegisterValidations, errorMiddleware }