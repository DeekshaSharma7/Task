import express from "express";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("Admin"), getEmployees);
router.post("/", protect, authorizeRoles("Admin", "Manager"), addEmployee);
router.put("/:id", protect, authorizeRoles("Admin", "Manager"), updateEmployee);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteEmployee);

export default router;
