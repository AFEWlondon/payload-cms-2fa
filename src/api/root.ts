import { Router } from "express";
import authRouter from "./auth/auth.controller";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

export default apiRouter;
