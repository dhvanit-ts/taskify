import { Router } from 'express';
import { createTask, getTodosByBoardId, updateTask } from '../controllers/task.controller';

const router = Router();
router.post('/create', createTask);
router.patch('/update/:id', updateTask);
router.get('/board/:id', getTodosByBoardId);

export default router;