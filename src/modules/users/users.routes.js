import { Router } from "express"
import { createUser, getAllUsers, getUserById, updateUser } from "./users.controller.js"

const router = Router()

router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.post("/create", createUser)
router.put("/:id", updateUser)

export default router