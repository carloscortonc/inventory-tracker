import AuthService from "@/services/auth";
import { RequestError } from "@/modules/error";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

/** Middleware to authenticate routes */
export const authenticated = async (ctx: any, next: any) => {
  // Token may come from cookies (user) or authorization header (service)
  const token =
    ctx.cookies.get(ACCESS_TOKEN_KEY) ||
    ctx.headers.authorization?.split("Bearer ")[1];
  try {
    ctx.user = AuthService.verifyToken(token, "access");
  } catch (e) {
    throw new RequestError({ status: 401, message: "Unauthorized" });
  }
  await next();
};
