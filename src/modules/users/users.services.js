import pool from "../../config/db.js";
import { listCode } from "../../statusCodes/index.js";

export const getAllUsersServices = async ({
  limitNumber,
  activeBoolean,
  offsetNumber,
}) => {
  try {
    if (activeBoolean === undefined) {
      const { rows } = await pool.query(
        `select id, name, email, active, created_at from users order by created_at desc limit $1 offset $2;`,
        [limitNumber, offsetNumber],
      );
      return rows;
    } else {
      const { rows } = await pool.query(
        `select id, name, email, active, created_at from users where active = $1 order by created_at desc limit $2 offset $3;`,
        [activeBoolean, limitNumber, offsetNumber],
      );
      return rows;
    }
  } catch (error) {
    console.error("Error en getAllUsersServices", error);
    const errors = new Error(listCode.getAllUsersError.message);
    errors.statusCode = listCode.getAllUsersError.status;
    throw errors;
  }
};

export const getUserByIdServices = async (id) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, active, created_at from users where id = $1`,
      [id],
    );

    if (rows.length < 1) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error("Error en getUserById", error);
    const errors = new Error(listCode.getUserByIdError.message);
    errors.statusCode = listCode.getUserByIdError.status;
    throw errors;
  }
};

export const createUserServices = async ({ name, email, active = true }) => {
  try {
    const { rows } = await pool.query(
      `insert into users (name, email, active) values ($1, $2, $3) returning id, name, email, active, created_at`,
      [name.toLowerCase(), email.toLowerCase(), active],
    );

    return rows[0];
  } catch (error) {
    console.error("create user error", error.code);
    const err = new Error(
      (error.code === "23505"
        ? listCode.emailAlreadyExists.message
        : "Internal error server"),
    );
    err.statusCode = error.code === "23505"
      ? listCode.emailAlreadyExists.status
      : 500;

    throw err;
  }
};
