import jwt from "jsonwebtoken";
import { createHttpError } from "../../errors/httpError.js";
import { listCode } from "../../statusCodes/index.js";
import { isValidEmail } from "../../utils/index.js";
import { userExistService } from "./auth.services.js";
import bcrypt from "bcrypt";
import "dotenv/config";

const SECRET_KEY = process.env.JWT_SECRET;

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!SECRET_KEY)
    throw createHttpError(500, "Internal server error", {
      error: "secret_key no esta definido",
    });

  const plainPassword = password ?? null;

  if (!email?.trim() || !isValidEmail(email.trim())) {
    throw createHttpError(
      listCode.createUSerEmailInvalidError.status,
      listCode.createUSerEmailInvalidError.message,
    );
  }

  if (!plainPassword) {
    throw createHttpError(
      listCode.verifyCredentials.status,
      listCode.verifyCredentials.message,
    );
  }
  const searchUSer = await userExistService(email.trim());

  if (!searchUSer) {
    throw createHttpError(
      listCode.verifyCredentials.status,
      listCode.verifyCredentials.message,
    );
  }
  const ok = await bcrypt.compare(plainPassword, searchUSer?.password);

  if (!ok) {
    throw createHttpError(
      listCode.verifyCredentials.status,
      listCode.verifyCredentials.message,
    );
  }

  const payloadUserToken = {
    sub: searchUSer.id,
    role: searchUSer.role,
    email: searchUSer.email,
  };

  const token = jwt.sign(payloadUserToken, SECRET_KEY, { expiresIn: "1h" });

  res.status(200).json({
    message: "auth ok",
    data: {
      id: searchUSer.id,
      name: searchUSer.name,
      email: searchUSer.email,
      role: searchUSer.role,
      token,
    },
  });
};
