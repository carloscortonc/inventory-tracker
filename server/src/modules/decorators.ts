import { RequestError } from "@/modules/error";
import log from "@/modules/logger";

type Constructor = { new (...args: any[]): any };

export function Controller<T extends Constructor>(Target: T): T {
  return class extends Target {
    constructor(...args: any[]) {
      super(...args);
      const methodsToDecorate = Object.getOwnPropertyNames(
        Target.prototype
      ).filter(
        (n) =>
          n !== "constructor" &&
          typeof this[n] === "function" &&
          // assume methods starting with lowercase are private
          !n.startsWith("_")
      );
      for (const m of methodsToDecorate) {
        this[m] = this[m].bind(this);
        const descriptor = Object.getOwnPropertyDescriptor(this, m);
        const original = descriptor.value;
        descriptor.value = async function (ctx: any, ...rest: any[]) {
          return original
            .apply(this, [ctx, ...rest])
            .then((r: unknown) => {
              ctx.body = r || ctx.body;
              ctx.status = 200;
              return ctx.body;
            })
            .catch((e: Error) => {
              if (e instanceof RequestError) {
                throw e;
              }
              // wrapper for uncontrolled errors
              log({
                level: "ERROR",
                message: `[${Target.name}] ${e.message}`,
              });
              throw new RequestError({ status: 500, message: e.message });
            });
        };
        Object.defineProperty(this, m, descriptor);
      }
    }
  };
}
