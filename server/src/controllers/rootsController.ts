import { Request, Response } from 'express';
import { addRoot, deleteRoot, getRoots } from '../services/rootsService';

export const listRoots = async (_req: Request, res: Response) => {
    try {
        const roots = await getRoots();
        return res.status(200).json({ roots });
    } catch (error) {
        console.error('Error listing roots:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createRoot = async (req: Request, res: Response) => {
    try {
        const name = String(req.body?.name ?? '').trim();
        const rootPath = String(req.body?.path ?? '').trim();

        if (!name || !rootPath) {
            return res.status(400).json({ message: 'name and path are required' });
        }

        const root = await addRoot(name, rootPath);
        return res.status(201).json(root);
    } catch (error) {
        console.error('Error creating root:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const removeRoot = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id ?? '');
        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        const deleted = await deleteRoot(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Not found' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting root:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
