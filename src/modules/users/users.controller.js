import { listCode } from "../../statusCodes/index.js";
import {
  isboolean,
  isNameValid,
  isNumber,
  isValidEmail,
  isValidUUID,
} from "../../utils/index.js";
import { createUserServices, getAllUsersServices, getUserByIdServices } from "./users.services.js";

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

    const createUser = await createUserServices({name, email})
	console.log("TCL: createUser -> controller", createUser)
    return res.status(201).json({
        message:"Create User",
        data:createUser || {}
    })


  } catch (error) {
    const message = error.message || "Internal error server";
    const status = error.statusCode || 500;

    res.status(status).json({
      message,
      status,
    });
  }
};
