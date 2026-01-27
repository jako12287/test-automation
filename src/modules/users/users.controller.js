import { createHttpError } from "../../errors/httpError.js";
import { listCode } from "../../statusCodes/index.js";
import {
  isboolean,
  isNameValid,
  isNumber,
  isValidEmail,
  isValidUUID,
} from "../../utils/index.js";
import {
  createUserServices,
  deleteUserService,
  getAllUsersServices,
  getUserByIdServices,
  updateUserService,
} from "./users.services.js";

export const getAllUsers = async (req, res) => {
  const { limit, active, offset } = req.query;

  let limitNumber = isNumber(limit) ?? 20;
  let offsetNumber = isNumber(offset) ?? 0;
  let activeBoolean = undefined;
  if (offsetNumber < 0 || offsetNumber >= 100) {
    throw createHttpError(
      listCode.offsetError.status,
      listCode.offsetError.message,
    );
  }

  if (limitNumber >= 50 || limitNumber <= 0) {
    throw createHttpError(
      listCode.limitError.status,
      listCode.limitError.message,
    );
  }

  if (typeof isboolean[active] === "boolean") {
    activeBoolean = isboolean[active];
  }

  const data = await getAllUsersServices({
    limitNumber,
    activeBoolean,
    offsetNumber,
  });
  res.json({
    message: "all users",
    data: data || [],
  });
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id))
    throw createHttpError(
      listCode.isNotuudd.status,
      listCode.isNotuudd.message,
    );

  const data = await getUserByIdServices(id);

  if (!data) {
    throw createHttpError(
      listCode.userExist.status,
      listCode.userExist.message,
    );
  }

  return res.status(200).json({
    message: "User by id",
    data: data || {},
  });
};

export const createUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name?.trim() || !email?.trim()) {
    throw createHttpError(
      listCode.createUserNoNameOrEmailError.status,
      listCode.createUserNoNameOrEmailError.message,
    );
  }

  if (!isNameValid(name)) {
    throw createHttpError(
      listCode.createUSerNameInvalidError.status,
      listCode.createUSerNameInvalidError.message,
    );
  }

  if (!isValidEmail(email)) {
    throw createHttpError(
      listCode.createUSerEmailInvalidError.status,
      listCode.createUSerEmailInvalidError.message,
    );
  }

  const createUser = await createUserServices({ name, email });
  return res.status(201).json({
    message: "Create User",
    data: createUser || {},
  });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, active } = req.body;

  if (!isValidUUID(id)) {
    throw createHttpError(
      listCode.isNotuudd.status,
      listCode.isNotuudd.message,
    );
  }

  const hasName = name !== undefined;
  const hasEmail = email !== undefined;
  const hasActive = active !== undefined;

  if (!hasName && !hasEmail && !hasActive) {
    throw createHttpError(
      listCode.updateNoBody.status,
      listCode.updateNoBody.message,
    );
  }

  if (hasName) {
    if (typeof name !== "string" || !isNameValid(name)) {
      throw createHttpError(
        listCode.createUSerNameInvalidError.status,
        listCode.createUSerNameInvalidError.message,
      );
    }
  }

  if (hasEmail) {
    if (typeof email !== "string" || !isValidEmail(email)) {
      throw createHttpError(
        listCode.createUSerEmailInvalidError.status,
        listCode.createUSerEmailInvalidError.message,
      );
    }
  }

  if (hasActive) {
    if (typeof active !== "boolean") {
      throw createHttpError(
        listCode.isNotBoolean.status,
        listCode.isNotBoolean.message,
      );
    }
  }

  const updatePayload = { id };

  if (hasName) updatePayload.name = name;
  if (hasEmail) updatePayload.email = email;
  if (hasActive) updatePayload.active = active;

  const updated = await updateUserService(updatePayload);

  if (!updated) {
    throw createHttpError(
      listCode.userExist.status,
      listCode.userExist.message,
    );
  }

  return res.status(200).json({
    message: "Usuario actualizado",
    data: updated,
  });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidUUID(id)) {
    throw createHttpError(
      listCode.isNotuudd.status,
      listCode.isNotuudd.message,
    );
  }

  const userDelete = await deleteUserService(id);
  if (!userDelete) {
    throw createHttpError(
      listCode.userExist.status,
      listCode.userExist.message,
    );
  }

  return res.status(204).send();
};
