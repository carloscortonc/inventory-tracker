import util from "util";
import Koa from "koa";
import fastRedact from "fast-redact";

// Global reference to the stream being used for logging
let _stream: NodeJS.WriteStream = process.stdout;

const bodyRedact = fastRedact({ paths: ["password"] });

const simpleDateFormat = () => new Date().toISOString().replace("T", " ").slice(0, -1);

/**
 *  Log utility. By default uses the write-stream defined for the middleware
 * @param params log parameters
 * @param stream Write-stream to write to
 */
const log = (params: { level: "INFO" | "ERROR"; message: string } & Record<string, any>, stream = _stream) => {
  const { message, level, ...rest } = params;
  const m = util
    .format("[%s] %s", simpleDateFormat(), level)
    .concat(
      " ",
      message,
      ...(Object.keys(rest).length > 0 ? [" ", util.inspect(rest, { compact: true, breakLength: Infinity })] : ""),
      "\n",
    );
  stream.write(m);
};

// Create shortcut method for info and error messages
log.info = (message: string, params: Record<string, any> = {}) => log({ level: "INFO", message, ...params });
log.error = (message: string, params: Record<string, any> = {}) => log({ level: "ERROR", message, ...params });

export const logger = (stream: NodeJS.WriteStream = process.stdout) => {
  _stream = stream;
  return async (ctx: Koa.Context, next: any) => {
    await next();
    const message = util.format("%s %s %s", ctx.method, ctx.path, ctx.status);
    log.info(message, {
      user: ctx.user?.username,
      ip: ctx.ip,
      ...(ctx.request.body && { body: bodyRedact(ctx.request.body) }),
    });
  };
};

export default log;
