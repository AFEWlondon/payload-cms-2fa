import React, { useState, useEffect } from "react";
import { useAuth } from "payload/components/utilities";
import { User } from "payload/generated-types";
import { TextInput } from "payload/components/forms";
import { Button } from "payload/components";
import { verify } from "crypto";
import QRCode from "react-qr-code";

interface GetOTPResponse {
  otpauth_url: string;
  base32Secret: string;
}

const getOTP = async (token: string): Promise<GetOTPResponse> => {
  const res = await fetch("/api/v1/auth/tfa/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

const verifyOTP = async (code: string, token: string) => {
  const res = await fetch("/api/v1/auth/tfa/verify", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  return res.json();
};

const validateOTP = async (code: string, token: string) => {
  const res = await fetch("/api/v1/auth/tfa/validate", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  return res.json();
};

const TFAPage = () => {
  const { user, token } = useAuth<User>();
  const [code, setCode] = useState("");
  const [optauthUrl, setOtpauthUrl] = useState("");
  const [otpSecret, setOtpSecret] = useState("");
  const [invalidCode, setInvalidCode] = useState(false);

  const sendValidate = async () => {
    const res = await validateOTP(code, token);
    if (!res.error) return (window.location.href = "/admin");
    setInvalidCode(true);
  };

  const sendVerify = async () => {
    const res = await verifyOTP(code, token);
    if (!res.error) return (window.location.href = "/admin");
    setInvalidCode(true);
  };

  useEffect(() => {
    if (!user.otp?.otpVerified) {
      getOTP(token).then((res) => {
        setOtpSecret(res.base32Secret);
        setOtpauthUrl(res.otpauth_url);
      });
    }
  }, []);

  return (
    <div>
      <div>
        <div>Hello, {user.email}</div>
        <a href="/logout">Logout</a>
      </div>
      {user.otp?.otpVerified ? (
        <div>
          <TextInput
            name={"code"}
            path={"code"}
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={sendValidate}>Confirm</Button>
          {invalidCode && <p>Code is invalid</p>}
        </div>
      ) : (
        <div>
          <QRCode
            value={optauthUrl}
            style={{
              padding: "20px",
              backgroundColor: "#fff",
            }}
          />
          <span>Secret: {otpSecret}</span>
          <TextInput
            name={"code"}
            path={"code"}
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={sendVerify}>Confirm</Button>
          {invalidCode && <p>Code is invalid</p>}
        </div>
      )}
    </div>
  );
};

export default TFAPage;
