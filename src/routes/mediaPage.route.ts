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
    uploadMediaPageImage,
    resizeMediaPageImage,
    validateMediaPage,
    addDataToMediaPage as RequestHandler
  );

router
  .route("/:id")
  .get(getMediaPageData)
  .put(updateMediaPageData)
  .delete(deleteMediaPageData);
export default router;
