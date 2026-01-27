export const errorHandler = (err, req, res, next) => {
  const status = err?.statusCode ?? 500;
  const message = err?.message ?? "Internal server error";

  if (status >= 500) {
    console.error("[ERROR]", {
      method: req.method,
      path: req.originalUrl,
      status,
      message,
      stack: err?.stack,
      details: err?.details,
    });
  }

  if (res.headersSent) return next(err);

  return res.status(status).json({
    statusCode: status,
    message,
  });
};
