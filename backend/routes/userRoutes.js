// routes/userRoutes.js

import express from "express";
import {
  register,
  updateUser,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Create/register new user
router.post("/register", register);

// Get all users
router.get("/", getUsers);

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
