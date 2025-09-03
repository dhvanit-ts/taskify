import { Router } from "express";
import { createBoard, getAllBoards } from "../controllers/board.controller";
import { verifyAdminJWT } from "../middlewares/auth.middleware";

const router = Router();
router.get("/all", verifyAdminJWT, getAllBoards);
router.post("/create", verifyAdminJWT, createBoard);

export default router;
