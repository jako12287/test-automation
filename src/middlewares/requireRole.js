import { createHttpError } from "../errors/httpError.js";
import { listCode } from "../statusCodes/index.js";

export const requireRole = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user?.role) {
      return next(
        createHttpError(listCode.notAuth.status, listCode.notAuth.message),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        createHttpError(listCode.Forbidden.status, listCode.Forbidden.message),
      );
    }

    return next();
  };
};
