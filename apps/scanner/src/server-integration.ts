import config from "./config";
import ProductService from "../../server/src/services/product";
import log from "../../server/src/modules/logger";

export async function sendCode(code: string) {
  return request({ path: "/api/products/".concat(code), method: "put" })
    .then((r) => console.log(r))
    .catch(console.log);
}

export async function updateProduct(code: string) {
  const product = await ProductService.getProduct(code).catch(() => null);
  if (!product) {
    log.error("[scanner::update-product] Product not found", { code });
    return;
  }
  const newQuantity = (product.quantity || 0) - 1;
  return ProductService.updateProduct({ code: code, quantity: newQuantity })
    .then(() => {
      log.info("[scanner::update-product] Product quantity updated", { code, quantity: newQuantity });
    })
    .catch(() => {
      log.error("[scanner::update-product] Error updating product quantity", { code, newQuantity });
    });
}

async function request(options: {
  path: string;
  method: "post" | "put";
  body?: any;
  headers?: Record<string, string>;
  noAuth?: boolean;
}) {
  const authHeaders = await (options.noAuth
    ? {}
    : generateToken().then((t) => ({
        Authorization: `Bearer ${t}`,
      })));
  return new Promise(async (resolve, reject) => {
    const r = await fetch(config.SERVER_URL.concat(options.path), {
      method: options.method,
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: { ...(options.headers || {}), ...authHeaders },
    });
    if (!r.ok) {
      const err = await r.json().catch(() => "Error in request");
      return reject(err);
    }
    const res = await r.json().catch(() => ({}));
    resolve(res);
  });
}

async function generateToken() {
  return request({
    path: "/api/auth/service",
    method: "post",
    headers: {
      Authorization: `Basic ${Buffer.from([config.SRV_USERNAME, config.SRV_PASSWORD].join(":")).toString("base64")}`,
    },
    noAuth: true,
  }).then((r: any) => {
    console.log("[auth]", r);
    return r.token;
  });
}
