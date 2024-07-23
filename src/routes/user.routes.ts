import { RequestHandler, Router } from "express";
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

router
  .route("/")
  .post(
    uploadUserImage as RequestHandler,
    resizeImage as RequestHandler,
    validateUser as RequestHandler,
    createUser as RequestHandler
  )
  .get(getAllUsers as RequestHandler);

router
  .route("/:id")
  .put(
    uploadUserImage as RequestHandler,
    resizeImage as RequestHandler,
    updateUser as RequestHandler
  )
  .delete(deleteUser as RequestHandler);

export default router;
