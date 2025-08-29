import { Router } from 'express';
import { createTask } from '../controllers/task.controller';

const router = Router();
router.post('/create', createTask);

export default router;