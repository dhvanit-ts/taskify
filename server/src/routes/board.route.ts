import { Router } from "express";
import { createBoard, getAllBoards, updateBoard } from "../controllers/board.controller";
import { verifyAdminJWT } from "../middlewares/auth.middleware";

const router = Router();
router.get("/all", verifyAdminJWT, getAllBoards);
router.post("/create", verifyAdminJWT, createBoard);
router.post("/update/:id", verifyAdminJWT, updateBoard);

export default router;
