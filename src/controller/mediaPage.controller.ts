import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import MediaPage from "../model/mediaCenterPage";
import ApiError from "../utiles/apiError";
import ApiFeatures from "../utiles/apiFeatures";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import multer from "multer";
import path from "path";

// const multerStorage = multer.memoryStorage();
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = `image-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const multerFilter: any = function (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only image allowed", 404) as unknown as null, false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadMediaPageImage = upload.fields([
  {
    name: "image",
    maxCount: 1,
  },
  { name: "headerImages", maxCount: 5 },
]);

export const resizeMediaPageImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log(files["headerImages"]);
};

export const addDataToMediaPage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { header, event, Gallery, Videos } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    header.image = files["headerImages"].map((image: any) => image.path);
    event.image= files["image"][0].path
    const mediaPageEntry = await MediaPage.create({
      header,
      event,
      Gallery,
      Videos,
    });

    res.status(201).json({ status: "Success", data: mediaPageEntry });
  }
);

export const getMediaPageData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const queryString = req.query;

    const totalDocuments = await MediaPage.count();

    let apiFeatures = new ApiFeatures({}, queryString);
    apiFeatures = apiFeatures.filter().limitFields();
    await apiFeatures.paginate(totalDocuments);

    const mediaPages = await MediaPage.findAll(apiFeatures.query);

    res.status(200).json({
      pagination: apiFeatures.paginationResult,
      data: mediaPages,
    });
  }
);

export const updateMediaPageData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { header, event, Gallery, Videos } = req.body;

    const mediaPageData = await MediaPage.findByPk(id);

    if (!mediaPageData) {
      return next(new ApiError("Media page data not found", 404));
    }

    mediaPageData.header = header;
    mediaPageData.event = event;
    mediaPageData.Gallery = Gallery;
    mediaPageData.Videos = Videos;

    await mediaPageData.save();

    res.status(200).json({ status: "Success", data: mediaPageData });
  }
);

export const deleteMediaPageData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const mediaPageData = await MediaPage.findByPk(id);

    if (!mediaPageData) {
      return next(new ApiError("Media page data not found", 404));
    }

    await mediaPageData.destroy();

    res.status(204).json({ status: "Success", data: null });
  }
);
