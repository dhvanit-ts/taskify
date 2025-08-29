import { Router } from 'express';
import { createTask, updateTask } from '../controllers/task.controller';

const router = Router();
router.post('/create', createTask);
router.patch('/update/:id', updateTask);

export default router;