import payload from "payload";
import { PayloadRequest } from "payload/types";
import crypto from "crypto";
import { encode } from "hi-base32";
import * as OTPAuth from "otpauth";

const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

const postGenerateOTPToken = async (req: PayloadRequest, res) => {
  const user = await payload.findByID({
    collection: "users",
    id: req.user.id,
    depth: 0,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp.otpVerified) {
    throw new Error("OTP already verified");
  }

  const base32Secret = generateRandomBase32();

  const totp = new OTPAuth.TOTP({
    issuer: "PayloadCMS TFA",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    secret: base32Secret,
  });

  const otpauth_url = totp.toString();

  await payload.update({
    collection: "users",
    id: user.id,
    data: {
      otp: {
        otpBase32Secret: base32Secret,
        otpauthUrl: otpauth_url,
      },
    },
  });

  return {
    otpauth_url,
    base32Secret,
  };
};

const postVerifyTFAToken = async (req: PayloadRequest, res) => {
  const { code }: { code?: string } = req.body;

  if (!code) {
    throw new Error("Code is required");
  }

  if (code.length !== 6) {
    throw new Error("Invalid code length");
  }

  const user = await payload.findByID({
    collection: "users",
    id: req.user.id,
    depth: 0,
  });

  const totp = new OTPAuth.TOTP({
    issuer: "PayloadCMS TFA",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    secret: user.otp.otpBase32Secret,
  });

  let delta = totp.validate({ token: code });

  if (delta === null) {
    throw new Error("Invalid code");
  }

  const updatedUser = await payload.update({
    collection: "users",
    id: user.id,
    data: {
      otp: {
        otpVerified: true,
        otpSessionExpires: new Date(Date.now() + 1000 * 60 * 60 * 24).getTime(), // 24hours
      },
    },
  });

  return updatedUser.otp;
};

const postValidateTFAToken = async (req: PayloadRequest, res) => {
  const { code }: { code?: string } = req.body;

  if (!code) {
    throw new Error("Code is required");
  }

  if (code.length !== 6) {
    throw new Error("Invalid code length");
  }

  const user = await payload.findByID({
    collection: "users",
    id: req.user.id,
    depth: 0,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp.otpVerified) {
    throw new Error("OTP already verified");
  }

  const totp = new OTPAuth.TOTP({
    issuer: "PayloadCMS TFA",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    secret: user.otp.otpBase32Secret,
  });

  let delta = totp.validate({ token: code });

  if (delta === null) {
    throw new Error("Invalid code");
  }

  const updatedUser = await payload.update({
    collection: "users",
    id: user.id,
    data: {
      otp: {
        otpSessionExpires: new Date(Date.now() + 1000 * 60 * 60 * 24).getTime(), // 24hours
      },
    },
  });

  return updatedUser.otp;
};

export { postGenerateOTPToken, postVerifyTFAToken, postValidateTFAToken };
