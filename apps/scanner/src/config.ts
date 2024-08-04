import dotenv from "dotenv";
dotenv.config();

export default {
  SERVER_URL: process.env.SERVER_URL,
  SRV_USERNAME: "scannersrv",
  SRV_PASSWORD: process.env.SRV_PASSWORD,
};
