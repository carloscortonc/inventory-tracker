import config from "@/config";

type RequestOptions = {
  body?: object;
  headers?: Record<string, string>;
  /** Http method. `get` is already default */
  method?: "post" | "put" | "delete";
};
export async function request<E = unknown>(path: string, options: RequestOptions = {}): Promise<E> {
  const { body, ...rest } = options;
  const headers = { ...(body ? { "content-type": "application/json" } : {}), ...(options.headers || {}) };
  return fetch(config.serverUrl.concat(path), {
    ...rest,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((r) => {
      if (!r.ok) {
        throw r;
      }
      return (r.status !== 204 ? r.json() : {}) as E;
    })
    .catch(async (e) => {
      const err = (await e.json?.().catch(() => undefined)) || e;
      throw err;
    });
}
