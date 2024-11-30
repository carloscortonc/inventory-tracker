import config from "@/config";

export async function request<E = unknown>(options: { path: string } & RequestInit): Promise<E> {
  const { path, ...rest } = options;
  const headers = { ...(options.headers || {}) };
  return fetch(config.serverUrl.concat(options.path), { ...rest, headers, credentials: "include" })
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
