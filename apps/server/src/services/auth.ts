import jwt from "jsonwebtoken";
import { User } from "@/entities/user";
import { hash } from "@/modules/utils";
import config from "@/modules/config";
import UserSchema from "@/schemas/user";

class AuthService {
  /**
   * Validate if the provided credentials are valid
   * @param user with the credentials to validate
   */
  async validateUser(user: User) {
    const u = await UserSchema.findOne({ username: user.username });
    if (!!user.isServiceAccount !== !!u.isServiceAccount || hash(user.password) !== u.password) {
      throw new Error("Error verifying user");
    }
    return u.toJSON();
  }

  generateTokens(user: Omit<User, "password">) {
    const accessToken = jwt.sign({ user }, config.auth.accessTokenSecret, {
      expiresIn: config.auth.expiration.access,
    });
    const refreshToken = jwt.sign({ user }, config.auth.refreshTokenSecret, {
      expiresIn: config.auth.expiration.refresh,
    });
    return {
      accessToken,
      refreshToken,
      expiresIn: config.auth.expiration.access,
    };
  }

  verifyToken(token: string, type: "access" | "refresh"): Omit<User, "password"> {
    const tokenSecret = type === "access" ? config.auth.accessTokenSecret : config.auth.refreshTokenSecret;
    try {
      return (jwt.verify(token, tokenSecret) as { user: User }).user;
    } catch (e) {
      throw new Error("Error verifying token: ".concat(e.message));
    }
  }
}

export default new AuthService();
