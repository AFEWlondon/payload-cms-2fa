import React, { useEffect } from "react";
import { useAuth } from "payload/components/utilities";
import { User } from "payload/generated-types";
import { checkOTPExpiration } from "./checkOtPExpiration";

interface TFAProviderProps {
  children: React.ReactNode;
}

const TFAProvider: React.FC<TFAProviderProps> = (props) => {
  const { token, user } = useAuth<User>();

  useEffect(() => {
    console.log("TFAProvider");
    if (user && window.location.pathname !== "/admin/tfa") {
      if (
        !user.otp?.otpVerified ||
        !user.otp.otpSessionExpires ||
        !checkOTPExpiration(user.otp.otpSessionExpires)
      ) {
        window.location.href = "/admin/tfa";
      }
    }
  }, [token, user]);
  return <main>{props.children}</main>;
};

export default TFAProvider;
