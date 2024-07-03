import { Router } from "express";
import { PayloadRequest } from "payload/types";
import {
  postGenerateOTPToken,
  postValidateTFAToken,
  postVerifyTFAToken,
} from "./auth.service";

const authRouter = Router();

authRouter.post("/tfa/generate", async (req: PayloadRequest, res) => {
  try {
    const response = await postGenerateOTPToken(req, res);
    res.send(response).status(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong...", error: true });
  }
});

authRouter.post("/tfa/verify", async (req: PayloadRequest, res) => {
  try {
    const response = await postVerifyTFAToken(req, res);
    res.send(response).status(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong...", error: true });
  }
});

authRouter.post("/tfa/validate", async (req: PayloadRequest, res) => {
  try {
    const response = await postValidateTFAToken(req, res);
    res.send(response).status(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong...", error: true });
  }
});

export default authRouter;
