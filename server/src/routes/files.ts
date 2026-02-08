import { Router } from 'express';
import { fetchFileTree } from '../controllers/filesController';

const router = Router();

// GET /api/files?rootId=...&path=...&pageSize=25&cursor=0
router.get('/', fetchFileTree);

export default router;
