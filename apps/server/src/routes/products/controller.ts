import Koa from "koa";
import ProductService from "@/services/product";
import { Controller } from "@/modules/decorators";
import { RequestError } from "@/modules/error";
import { Product } from "@/entities/product";

@Controller
class ProductsController {
  async getProducts() {
    return ProductService.getAllProducts();
  }
  async getProduct(ctx: Koa.Context) {
    return ProductService.getProduct(ctx.params.code).catch(() => {
      throw new RequestError({ status: 404, message: "Product not found" });
    });
  }
  async registerProduct(ctx: Koa.Context) {
    const data = <Product>ctx.request.body;
    return ProductService.saveProduct(data);
  }
  async updateProduct(ctx: Koa.Context) {
    const data = <Product>ctx.request.body;
    return ProductService.updateProduct(data);
  }
}

export default new ProductsController();
