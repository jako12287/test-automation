import jwt from "jsonwebtoken";
import { createHttpError } from "../errors/httpError.js";
import "dotenv/config";
import { listCode } from "../statusCodes/index.js";

const SECRET_KEY = process.env.JWT_SECRET;

export const requireAuth = (req, _res, next) => {
  if (!SECRET_KEY) {
    return next(
      createHttpError(500, "Internal server error", {
        error: "SECRET_KEY no esta definido",
      }),
    );
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(
      createHttpError(
        listCode.missingAuth.status,
        listCode.missingAuth.message,
      ),
    );
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(
      createHttpError(
        listCode.invalidAuth.status,
        listCode.invalidAuth.message,
      ),
    );
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);

    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (error) {
    return next(
      createHttpError(
        listCode.expiredAuth.status,
        listCode.expiredAuth.message,
      ),
    );
  }
};
