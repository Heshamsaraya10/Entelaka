import { Request, Response, NextFunction } from "express";
import validationSchema from "../../ValidatorsSchema/aboutPage.validator";

export const validateAboutPage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
    const { header, description, userId, footer } = req.body;

    const validationResult = validationSchema.validate({
        header,
        description,
        userId,
        footer,
    });

    if (validationResult.error)
        return res.status(400).json({
        message: "Error validating the body of the request",
        erorr: validationResult.error.details,
        data: null,
        });
    next();
} catch (error) {
    console.log("Internal Server Error", error);
    res
        .status(500)
        .json({ message: "Internal Server Error", error: null, data: null });
}
};
