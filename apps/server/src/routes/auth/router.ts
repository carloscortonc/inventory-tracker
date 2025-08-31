import Router from "@koa/router";
import Controller from "./controller";
import { authenticated } from "@/modules/auth";

const router = new Router()
  .prefix("/auth")
  .get("/", authenticated, Controller.getAuthorization)
  .post("/service", Controller.authenticateService)
  .post("/user", Controller.authenticateUser)
  .post("/refresh", Controller.refreshUser)
  .post("/revoke", Controller.revoke);

export default router;
