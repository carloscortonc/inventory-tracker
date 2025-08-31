import Koa from "koa";
import omit from "lodash.omit";
import ms from "ms";
import { User } from "@/entities/user";
import { Controller } from "@/modules/decorators";
import { RequestError } from "@/modules/error";
import AuthService from "@/services/auth";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/modules/auth";

@Controller
class AuthController {
  async getAuthorization(ctx: Koa.Context) {
    return ctx.user;
  }

  async authenticateService(ctx: Koa.Context) {
    let user: User = { isServiceAccount: true } as User;
    try {
      const authorization = ctx.headers.authorization || " ";
      [user.username, user.password] = Buffer.from(authorization.split(" ")[1], "base64").toString().split(":");
      user = await AuthService.validateUser(user);
    } catch {
      throw new RequestError({ status: 401, message: "Invalid credentials" });
    }
    const { accessToken, expiresIn } = AuthService.generateTokens(omit(user, "password"));
    return { token: accessToken, expiresIn: ms(expiresIn) / 1000 };
  }

  async authenticateUser(ctx: Koa.Context) {
    let user: User = {
      ...(<Partial<User>>(ctx.request.body || {})),
      isServiceAccount: false,
    } as User;
    user = await AuthService.validateUser(user).catch(() => {
      this._clearCookies(ctx);
      throw new RequestError({ status: 401, message: "Invalid credentials" });
    });
    this._setUserTokens(ctx, user);
    ctx.status = 204;
  }

  async refreshUser(ctx: Koa.Context) {
    const refreshToken = ctx.cookies.get(REFRESH_TOKEN_KEY);
    let user: User;
    try {
      user = <User>AuthService.verifyToken(refreshToken, "refresh");
    } catch (e) {
      this._clearCookies(ctx);
      throw new RequestError({ status: 401, message: "Unauthorized" });
    }
    this._setUserTokens(ctx, user);
  }

  async revoke(ctx: Koa.Context) {
    this._clearCookies(ctx);
  }

  private _setUserTokens(ctx: Koa.Context, user: User) {
    const { accessToken, refreshToken } = AuthService.generateTokens(omit(user, "password"));
    Object.entries({
      [ACCESS_TOKEN_KEY]: accessToken,
      [REFRESH_TOKEN_KEY]: refreshToken,
    }).forEach(([k, v]) => {
      ctx.cookies.set(k, v, { sameSite: "strict", httpOnly: true, secure: true });
    });
  }

  private _clearCookies(ctx: Koa.Context) {
    [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY].forEach((k) => {
      ctx.cookies.set(k, undefined, { sameSite: "strict", httpOnly: true, secure: true });
    });
  }
}

export default new AuthController();
