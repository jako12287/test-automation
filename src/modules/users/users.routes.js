import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./users.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";

const router = Router();

router.get("/", asyncHandler(getAllUsers));
router.get("/:id", requireAuth, asyncHandler(getUserById));
router.post("/", requireAuth, asyncHandler(createUser));
router.put("/:id", requireAuth, asyncHandler(updateUser));
router.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(deleteUser));

export default router;
