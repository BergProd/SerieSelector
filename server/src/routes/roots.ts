import { Router } from 'express';
import { createRoot, listRoots, removeRoot } from '../controllers/rootsController';

const router = Router();

router.get('/', listRoots);
router.post('/', createRoot);
router.delete('/:id', removeRoot);

export default router;
