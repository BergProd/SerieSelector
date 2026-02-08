import { Request, Response } from 'express';
import { getDestination, setDestination } from '../services/settingsService';
import { getRootById } from '../services/rootsService';

export const getDestinationSetting = async (_req: Request, res: Response) => {
    try {
        const destination = await getDestination();
        return res.status(200).json(destination);
    } catch (error) {
        console.error('Error getting destination setting:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateDestinationSetting = async (req: Request, res: Response) => {
    try {
        const rootId = String(req.body?.rootId ?? '').trim();
        const relPath = String(req.body?.relPath ?? '').trim();

        if (!rootId) {
            return res.status(400).json({ message: 'rootId is required' });
        }

        const root = await getRootById(rootId);
        if (!root) {
            return res.status(400).json({ message: 'Unknown rootId' });
        }

        const updated = await setDestination({ rootId, relPath });
        return res.status(200).json(updated);
    } catch (error) {
        console.error('Error updating destination setting:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
