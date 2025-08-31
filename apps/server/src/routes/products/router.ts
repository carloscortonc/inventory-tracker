import Router from "@koa/router";
import Controller from "./controller";

const router = new Router()
  .prefix("/products")
  .get("/", Controller.getProducts)
  .post("/", Controller.registerProduct)
  .get("/:code", Controller.getProduct)
  .put("/:code", Controller.updateProduct)
  .delete("/:code", Controller.deleteProduct);

export default router;
