import { RequestHandler, Router } from "express";
import {
  addDataToMediaPage,
  getMediaPageData,
  updateMediaPageData,
  deleteMediaPageData,
  uploadMediaPageImage,
  resizeMediaPageImage,
} from "../controller/mediaPage.controller";
import { validateMediaPage } from "../middlewares/Validation Middlewares/mediaPage.validation.middleware";
const router = Router();

router
  .route("/")
  .post(
    uploadMediaPageImage as RequestHandler,
    resizeMediaPageImage as RequestHandler,
    validateMediaPage as RequestHandler,
    addDataToMediaPage as RequestHandler
  );

router
  .route("/:id")
  .get(getMediaPageData as RequestHandler)
  .put(updateMediaPageData as RequestHandler)
  .delete(deleteMediaPageData as RequestHandler);
export default router;
