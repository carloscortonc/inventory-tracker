import dotenv from "dotenv";
// import path from "path";

// load configuration
dotenv.config(/* { path: path.join(process.cwd(), "..", ".env") } */);

export default {
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGO_URI,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
  },
  auth: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    expiration: {
      access: "5s",
      refresh: "3d",
    },
  },
  email: {
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    secret: process.env.EMAIL_SECRET,
  },
  srvuser: {
    username: "scannersrv",
    password: process.env.SRV_PASSWORD,
  },
} as const;
