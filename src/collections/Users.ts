import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      type: "group",
      name: "otp",
      admin: {
        hidden: false,
        readOnly: false,
      },
      fields: [
        {
          type: "checkbox",
          name: "otpVerified",
          label: "OTP Verified",
          defaultValue: false,
          admin: {
            hidden: false,
          },
        },
        {
          type: "text",
          name: "otpBase32Secret",
          label: "OTP Secret",
          admin: {
            hidden: false,
          },
        },
        {
          type: "text",
          name: "otpauthUrl",
          label: "OTP Auth URL",
          admin: {
            hidden: false,
          },
        },
        {
          type: "number",
          name: "otpSessionExpires",
          label: "OTP Session Expires",
          admin: {
            hidden: false,
          },
        },
      ],
    },
  ],
};

export default Users;
