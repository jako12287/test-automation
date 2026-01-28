import pool from "../../config/db.js";
import { createHttpError } from "../../errors/httpError.js";

export const userExistService = async (email) => {
  try {
    const psql = `select id, name, email, role, password from users where email = $1;`;

    const { rows } = await pool.query(psql, [email.trim().toLowerCase()]);

    return rows[0] ?? null;
  } catch (error) {
    throw createHttpError(500, "Internal server error", { pgcode: error.code });
  }
};
