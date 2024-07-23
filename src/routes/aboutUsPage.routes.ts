import { RequestHandler, Router } from "express";
import {
  addDataToPage,
  getDataFromPage,
  updateDataFromPage,
  deletePage,
  uploadAboutUsImage,
  resizeImage,
} from "../controller/aboutUsPage.controllers";
import { validateAboutPage } from "../middlewares/Validation Middlewares/aboutPage.validation.middleware";

const router = Router();

router
  .route("/")
  .post(
    uploadAboutUsImage as RequestHandler,
    resizeImage as RequestHandler,
    validateAboutPage as RequestHandler,
    addDataToPage as RequestHandler
  );

  router
  .route("/:id")
  .get(getDataFromPage as RequestHandler)
  .put(updateDataFromPage as RequestHandler)
  .delete(deletePage as RequestHandler);
export default router;
