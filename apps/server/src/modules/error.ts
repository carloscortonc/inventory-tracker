export class RequestError extends Error {
  status: number;
  constructor(p: { status: number; message: string }) {
    super(p.message);
    Object.assign(this, p);
  }
}

export const errorHandler = async (ctx: any, next: any) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message,
    };
  }
};
