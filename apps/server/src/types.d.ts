import { User } from "./entities/user";

declare module "koa" {
  interface Context {
    user: User;
  }
}
