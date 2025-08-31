import { Product } from "@/entities/product";
import ProductSchema from "@/schemas/product";
import { JSDOM } from "jsdom";

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return ProductSchema.find({});
  }

  async getProduct(code: string): Promise<Product & { registered: boolean }> {
    // look first in database
    const p = await ProductSchema.findOne({ code });
    if (p) {
      return { ...p.toObject(), registered: true };
    }
    // fetch product information
    return this.fetchProduct(code).then((p) => ({ ...p, registered: false }));
  }

  async saveProduct(data: Product) {
    return ProductSchema.create(data);
  }

  async updateProduct(data: Product) {
    const { code, ...rest } = data;
    return ProductSchema.findOneAndUpdate({ code: code }, rest, { new: true });
  }

  async deleteProduct(code: string) {
    return ProductSchema.findOneAndDelete({ code });
  }

  private async fetchProduct(code: string) {
    // Mock for testing to avoid rate-limit on queries
    return { code, name: "Product Name" } as Product;
    return fetch("https://go-upc.com/search?q=".concat(code || "4511338000151"))
      .then((r) => r.text())
      .then((r) => {
        const dom = new JSDOM(r);
        const name = dom.window.document.querySelector("h1.product-name")?.textContent;
        if (!name) {
          throw new Error("Not found");
        }
        return { code, name } as Product;
      });
  }
}

export default new ProductService();
