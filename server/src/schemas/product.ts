import { Product as ProductEntity } from "@/entities/product";
import mongoose from "mongoose";

const schema = new mongoose.Schema<ProductEntity>({
  code: { type: "string", unique: true },
  name: { type: "string", required: true },
  quantity: { type: "Number", default: 0 },
});

const Product = mongoose.model("products", schema);

export default Product;
