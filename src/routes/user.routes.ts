import { RequestHandler, Router } from "express";
import multer from "multer";
import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  uploadUserImage,
  resizeImage,
} from "../controller/user.controllers";
import { validateUser } from "../middlewares/Validation Middlewares/user.validation.middleware";
const router = Router();

const upload = multer({ dest: "src/uploads/users" });

router
  .route("/")
  .post(
    uploadUserImage,
    resizeImage,
    validateUser,
    createUser as RequestHandler
  )
  .get(getAllUsers);
router
  .route("/:id")
  .put(uploadUserImage, resizeImage, updateUser as RequestHandler)
  .delete(deleteUser);

export default router;
