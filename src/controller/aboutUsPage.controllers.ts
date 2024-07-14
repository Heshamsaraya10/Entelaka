import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";

import User from "../model/userModel";
import AboutPage from "../model/aboutUsPageModel";
import ApiError from "../utiles/apiError";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = `about-${Date.now()}${path.extname(file.originalname)}`;
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

export const uploadAboutUsImage = upload.fields([
  {
    name: "image",
    maxCount: 1,
  },
  { name: "headerImages", maxCount: 5 },
]);

//image processing
export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filename = `about-${uuidv4()}-${Date.now()}.jpeg`;
      if (req.file) {
        await sharp(req.file.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/${filename}`);

        req.body.image = filename;
      }
      next();
    } catch (error) {
      next(new ApiError("Image processing failed", 500));
    }
  }
);

export const addDataToPage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { header, footer, description, userId } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    header.image = files["headerImages"].map((image: any) => image.path);

    const aboutPage = await AboutPage.create({
      header,
      description,
      footer,
      userId,
    });

    res.status(201).json({ status:"Success", data: aboutPage });
  }
);

export const getDataFromPage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const aboutPage = await AboutPage.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    if (!aboutPage) {
      return next(new ApiError(`No page found with id ${id}`, 404));
    }

    res.status(201).json({ status: "Success", data: aboutPage });
  }
);

export const updateDataFromPage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { header, description, footer, userId } = req.body;

    const [update] = await AboutPage.update(
      {
        header,
        description,
        footer,
        userId,
      },
      {
        where: { id },
      }
    );
    if (update) {
      const updatedAboutPage = await AboutPage.findByPk(id);
      res.status(200).json({ data: updatedAboutPage });
    } else {
      return next(new ApiError(`No page for this id ${id}`, 404));
    }
  }
);

export const deletePage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pageId = req.params.id;

    const page = await User.findOne({ where: { id: pageId } });

    if (!page) {
      return next(new ApiError("page does not exist or Invalid ID.", 404));
    }

    await page.destroy();

    res.status(204).json({ status: "Success" });
  }
);
