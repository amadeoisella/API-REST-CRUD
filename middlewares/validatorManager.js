import { validationResult, body, param } from "express-validator";
import axios from "axios";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const paramLinkValidator = [
  param("id", "Invalid format (expressValidator)").trim().notEmpty().escape(),
  validationResultExpress,
];

export const bodyLinkValidator = [
  body("longLink", "Incorrect link format")
    .trim()
    .notEmpty()
    .custom(async (value) => {
      try {
        if (!value.startsWith("https://")) {
          value = "https://" + value;
        }
        console.log(value);

        await axios.get(value);
        return value;
      } catch (error) {
        // console.log(error);
        throw new Error("Not found longLink 404");
      }
    }),
  validationResultExpress,
];

export const bodyRegisterValidator = [
  body("email", "Invalid email format").trim().isEmail().normalizeEmail(),
  body("password", "Minimum 6 characters").trim().isLength({ min: 6 }),
  body("password", "Invalid password format")
    .trim()
    .isLength({ min: 6 })
    .custom((value, { req }) => {
      if (value !== req.body.repassword) {
        throw new Error("Passwords dont match");
      }
      return value;
    }),
  validationResultExpress,
];

export const bodyLoginValidator = [
  body("email", "Invalid email format").trim().isEmail().normalizeEmail(),
  body("password", "Minimum 6 characters").trim().isLength({ min: 6 }),
  validationResultExpress,
];
