import { Request, Response } from 'express';
import { listDirectory } from '../services/fsService';
import { getRootById } from '../services/rootsService';

// Lists a single directory level with pagination. Root is selected by id and
// the path is relative to that root. This replaces the previous "fetch full
// tree" behavior to avoid heavy operations on large pools.
export const fetchFileTree = async (req: Request, res: Response) => {
    try {
        const rootId = String(req.query.rootId ?? '');
        const relPath = String(req.query.path ?? '');
        const pageSize = Math.min(Number(req.query.pageSize ?? 25), 100);
        const cursor = Math.max(Number(req.query.cursor ?? 0), 0);

        if (!rootId) {
            return res.status(400).json({ message: 'rootId is required' });
        }

        const root = await getRootById(rootId);
        if (!root) {
            return res.status(400).json({ message: 'Unknown rootId' });
        }

        const result = await listDirectory({ rootPath: root.path, relPath, pageSize, cursor });
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error listing directory:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
