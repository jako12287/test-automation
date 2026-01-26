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
  try {
    if (offsetNumber < 0 || offsetNumber >= 100) {
      const error = new Error(listCode.offsetError.message);
      error.statusCode = listCode.offsetError.status;
      throw error;
    }

    if (limitNumber >= 50 || limitNumber <= 0) {
      const error = new Error(listCode.limitError.message);
      error.statusCode = listCode.limitError.status;
      throw error;
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
  } catch (error) {
    const status = error.statusCode ?? 500;
    const message = error.message ?? "Internal server error";
    res.status(status).json({
      statusCode: status,
      message,
    });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (isValidUUID(id)) {
      const data = await getUserByIdServices(id);

      if (!data) {
        return res.status(404).json({
          message: "User not found",
          status: 404,
        });
      }

      return res.status(200).json({
        message: "User by id",
        data: data || {},
      });
    } else {
      const error = new Error(listCode.isNotuudd.message);
      error.statusCode = listCode.isNotuudd.status;
      throw error;
    }
  } catch (error) {
    const message = error.message || "Internal server error";
    const status = error.statusCode || 500;

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
};

export const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!name?.trim() || !email?.trim()) {
      const error = new Error(listCode.createUserNoNameOrEmailError.message);
      error.statusCode = listCode.createUserNoNameOrEmailError.status;
      throw error;
    }

    if (!isNameValid(name)) {
      const error = new Error(listCode.createUSerNameInvalidError.message);
      error.statusCode = listCode.createUSerNameInvalidError.status;
      throw error;
    }

    if (!isValidEmail(email)) {
      const error = new Error(listCode.createUSerEmailInvalidError.message);
      error.statusCode = listCode.createUSerEmailInvalidError.status;
      throw error;
    }

    const createUser = await createUserServices({ name, email });
    console.log("TCL: createUser -> controller", createUser);
    return res.status(201).json({
      message: "Create User",
      data: createUser || {},
    });
  } catch (error) {
    const message = error.message || "Internal error server";
    const status = error.statusCode || 500;

    res.status(status).json({
      message,
      status,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, active } = req.body;

  try {
    if (!isValidUUID(id)) {
      const error = new Error(listCode.isNotuudd.message);
      error.statusCode = listCode.isNotuudd.status;
      throw error;
    }

    const hasName = name !== undefined;
    const hasEmail = email !== undefined;
    const hasActive = active !== undefined;

    if (!hasName && !hasEmail && !hasActive) {
      const error = new Error(listCode.updateNoBody.message);
      error.statusCode = listCode.updateNoBody.status;
      throw error;
    }

    if (hasName) {
      if (typeof name !== "string" || !isNameValid(name)) {
        const error = new Error(listCode.createUSerNameInvalidError.message);
        error.statusCode = listCode.createUSerNameInvalidError.status;
        throw error;
      }
    }

    if (hasEmail) {
      if (typeof email !== "string" || !isValidEmail(email)) {
        const error = new Error(listCode.createUSerEmailInvalidError.message);
        error.statusCode = listCode.createUSerEmailInvalidError.status;
        throw error;
      }
    }

    if (hasActive) {
      if (typeof active !== "boolean") {
        const error = new Error(listCode.isNotBoolean.message);
        error.statusCode = listCode.isNotBoolean.status;
        throw error;
      }
    }

    const updatePayload = { id };

    if (hasName) updatePayload.name = name;
    if (hasEmail) updatePayload.email = email;
    if (hasActive) updatePayload.active = active;

    const updated = await updateUserService(updatePayload);

    if (!updated) {
      const message = listCode.userExist.message;
      const status = listCode.userExist.status;
      return res.status(status).json({
        message,
        status,
      });
    }

    return res.status(200).json({
      message: "Usuario actualizado",
      data: updated,
    });
  } catch (error) {
    console.error("Error en updateUser", error);
    const message = error.message || "Internal server error";
    const status = error.statusCode || 500;

    res.status(status).json({
      message,
      status,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!isValidUUID(id)) {
      const err = new Error(listCode.isNotuudd.message);
      err.statusCode = listCode.isNotuudd.status;
      throw err;
    }

    const userDelete = await deleteUserService(id);
    if (!userDelete) {
      const error = new Error(listCode.userExist.message);
      error.statusCode = listCode.userExist.status;
      throw error;
    }

    return res.status(204).send();
  } catch (error) {
    console.error("error en controlador deleteUser", error);

    const message = error.message || "Internal server error";
    const status = error.statusCode || 500;

    res.status(status).json({
      message,
      status,
    });
  }
};
