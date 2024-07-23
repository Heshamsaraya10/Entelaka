import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import sharp from "sharp";

import { v4 as uuidv4 } from "uuid";
import User from "../model/userModel";

import ApiError from "../utiles/apiError";
import ApiFeatures from "../utiles/apiFeatures";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";

//Upload single image
export const uploadUserImage = uploadSingleImage("photo");

//image processing
export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      sharp(req.file!.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/${filename}`);

      // //save image into our db
      req.body.photo = filename;
    }

    next();
  }
);

// @desc    Create user
// @route   POST /api/v1/users
// @access  private/Admin
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, position, photo, description } = req.body;

    const createdUser = await User.create({
      username,
      position,
      photo,
      description,
    });

    res
      .status(201)
      .json({ status: res.__(`USER.CREATED_SUCCESSFULLY`), data: createdUser });
  }
);


export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return next(new Error(`No user found with id ${userId}`));
    }

    user.username = req.body.username || user.username;
    user.position = req.body.position || user.position;
    user.photo = req.body.photo || user.photo;
    user.description = req.body.description || user.description;

    await user.save();

    res.status(200).json({ data: user });
  }
);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const queryString = req.query;

    const totalDocuments = await User.count();

    let apiFeatures = new ApiFeatures({}, queryString);
    apiFeatures = apiFeatures.filter().limitFields();
    await apiFeatures.paginate(totalDocuments);

    const allUsers = await User.findAll(apiFeatures.query);

    res.status(200).json({
      pagination: apiFeatures.paginationResult,
      data: allUsers,
    });
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return next(new ApiError("user does not exist or Invalid ID.", 404));
    }

    await user.destroy();

    res.status(204).json({ status: res.__(`USER.CREATED_SUCCESSFULLY`) });
  }
);
