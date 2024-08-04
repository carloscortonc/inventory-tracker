import config from "@/config";

export async function sendCode(code: string) {
  console.log("[server-integration] sending code ...");
  return request({ path: "/api/products/".concat(code), method: "put" })
    .then((r) => console.log(r))
    .catch(console.log);
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
      Authorization: `Basic ${Buffer.from(
        [config.SRV_USERNAME, config.SRV_PASSWORD].join(":")
      ).toString("base64")}`,
    },
    noAuth: true,
  }).then((r: any) => {
    console.log("[auth]", r);
    return r.token;
  });
}
