import config from "./config";
import ProductService from "../../server/src/services/product";

// Use this if scanner is run in a separated process/instance
export async function sendCode(code: string) {
  return request({ path: `/api/products/${code}/decrement`, method: "post" })
    .then((r) => console.log(r))
    .catch(console.log);
}

export async function updateProduct(code: string) {
  return ProductService.decrementProduct(code);
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
