import pool from "../../config/db.js";
import { createHttpError } from "../../errors/httpError.js";
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
    throw createHttpError(
      listCode.getAllUsersError.status,
      listCode.getAllUsersError.message,
      { pgCode: error.code },
    );
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
    throw createHttpError(
      listCode.getUserByIdError.status,
      listCode.getUserByIdError.message,
      { pgCode: error.code },
    );
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
    if (error.code === "23505") {
      throw createHttpError(
        listCode.emailAlreadyExists.status,
        listCode.emailAlreadyExists.message,
      );
    }
    throw createHttpError(500, "Internal server error", { pgCode: error.code });
  }
};

export const updateUserService = async ({ name, email, active, id }) => {
  try {
    const setParts = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
      setParts.push(`name = $${idx}`);
      values.push(name.trim().toLowerCase());
      idx += 1;
    }

    if (email !== undefined) {
      setParts.push(`email = $${idx}`);
      values.push(email.trim().toLowerCase());
      idx += 1;
    }

    if (active !== undefined) {
      setParts.push(`active = $${idx}`);
      values.push(active);
      idx += 1;
    }

    if (setParts.length === 0) return null;

    values.push(id);

    const psql = `UPDATE users
    SET ${setParts.join(", ")} 
    WHERE id = $${idx}
    RETURNING id, name, email, active, created_at;`;

    const { rows } = await pool.query(psql, values);

    return rows[0] ?? null;
  } catch (error) {
    if (error.code === "23505") {
      throw createHttpError(
        listCode.emailAlreadyExists.status,
        listCode.emailAlreadyExists.message,
      );
    }

    throw createHttpError(500, "Internal server error", { pgCode: error.code });
  }
};

export const deleteUserService = async (id) => {
  try {
    const psql = `UPDATE users set active = false where id = $1 RETURNING id;`;
    const { rows } = await pool.query(psql, [id]);

    return rows[0] ?? null;
  } catch (error) {
    throw createHttpError(500, "Internal server error", { pgCode: error.code });
  }
};
