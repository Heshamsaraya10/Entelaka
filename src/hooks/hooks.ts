import { Express } from "express-serve-static-core";
import userRouter from "../routes/user.routes";
import aboutPageRouter from "../routes/aboutUsPage.routes";
import mediaPageRouter from "../routes/mediaPage.route";

const mountRoutes = (app: Express): void => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/aboutPage", aboutPageRouter);
  app.use("/api/v1/mediaPage", mediaPageRouter);
};

export default mountRoutes;
