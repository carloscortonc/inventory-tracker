import AuthService from "@/services/auth";
import { RequestError } from "@/modules/error";
import UserSchema from "@/schemas/user";
import { hash } from "./utils";
import config from "./config";
import logger from "./logger";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

/** Middleware to authenticate routes */
export const authenticated = async (ctx: any, next: any) => {
  // Token may come from cookies (user) or authorization header (service)
  const token = ctx.cookies.get(ACCESS_TOKEN_KEY) || ctx.headers.authorization?.split("Bearer ")[1];
  try {
    ctx.user = AuthService.verifyToken(token, "access");
  } catch (e) {
    throw new RequestError({ status: 401, message: "Unauthorized" });
  }
  await next();
};

export async function initializeServiceUser() {
  if (!config.srvuser.password) {
    logger.info("skipping service-user init: no password present");
    return;
  }
  const username = config.srvuser.username;
  const password = config.srvuser.password;
  return UserSchema.findOneAndUpdate(
    { isServiceAccount: true, username },
    { password: hash(password) },
    { new: true, upsert: true },
  ).then(() => {
    logger.info("service-user initialized");
  });
}
