import { Router } from "express"
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "./users.controller.js"

const router = Router()

router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.post("/create", createUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router