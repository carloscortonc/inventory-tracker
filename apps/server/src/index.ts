import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { parseCookie as cookieParser } from "koa-cookies";
import config from "@/modules/config";
import { init } from "@/modules/db";
import { errorHandler } from "@/modules/error";
import log, { logger } from "@/modules/logger";
import productsRouter from "@/routes/products/router";
import authRouter from "@/routes/auth/router";
import { authenticated, initializeServiceUser } from "@/modules/auth";
import { User } from "@/entities/user";

const app = new Koa<any, { user: User }>();
const apiRouter = new Router()
  .prefix("/api")
  .use(authRouter.routes())
  // authenticate remaining routers
  .use(authenticated)
  .use(productsRouter.routes());

// Logger
app.use(logger());

// Body parser
app.use(bodyParser());

// Cookie parser
app.use(cookieParser());

// Error handler
app.use(errorHandler);

// Routes
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

await init("scanner");

await initializeServiceUser();

app.listen(config.port, () => {
  log.info("Server listing on port ".concat(config.port));
});
