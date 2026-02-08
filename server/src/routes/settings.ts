import { Router } from 'express';
import { getDestinationSetting, updateDestinationSetting } from '../controllers/settingsController';

const router = Router();

// Destination settings (rootId + relPath)
router.get('/destination', getDestinationSetting);
router.put('/destination', updateDestinationSetting);

export default router;
