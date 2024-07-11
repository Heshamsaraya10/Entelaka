import { Request, Response, NextFunction } from "express";
import validationSchema from "../../ValidatorsSchema/user.validator";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, position, photo, description } = req.body;
    const validationResult = validationSchema.validate(
      {
        username,
        position,
        description,
      },
      { abortEarly: false }
    );

    if (validationResult.error) {
      const translatedErrors = validationResult.error.details.map((err) => {
        return res.__(`validation.${err.context?.key}.${err.type}`);
      });
      return res.status(400).json({ errors: translatedErrors });
    }
    next();
  } catch (error) {
    console.log("Internal Server Error", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: null, data: null });
  }
};
