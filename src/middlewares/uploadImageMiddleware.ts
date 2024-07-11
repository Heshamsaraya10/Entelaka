import multer from "multer";
import ApiError from "../utiles/apiError";

export const uploadSingleImage: any = (fieldName: string) => {
  const multerStorage = multer.memoryStorage();

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
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
