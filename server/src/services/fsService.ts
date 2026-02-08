import fs from 'fs/promises';
import path from 'path';
import type { Dirent } from 'fs';
type ListDirectoryArgs = {
    rootPath: string;
    relPath: string;
    pageSize: number;
    cursor: number;
};

function safeResolveUnderRoot(rootPath: string, relPath: string) {
    const base = path.posix.resolve(rootPath);
    const target = path.posix.resolve(base, '.' + '/' + (relPath ?? ''));

    if (!target.startsWith(base + '/') && target !== base) {
        throw new Error('Path escapes root');
    }

    return { base, target };
}

export async function listDirectory(args: ListDirectoryArgs) {
    const { target } = safeResolveUnderRoot(args.rootPath, args.relPath);

    const dirents: Dirent[] = await fs.readdir(target, { withFileTypes: true });

    dirents.sort((a: Dirent, b: Dirent) => {
        const ad = a.isDirectory() ? 0 : 1;
        const bd = b.isDirectory() ? 0 : 1;
        if (ad !== bd) return ad - bd;
        return a.name.localeCompare(b.name);
    });

    const start = args.cursor;
    const end = start + args.pageSize;
    const page = dirents.slice(start, end);

    const entries = await Promise.all(
        page.map(async (d: Dirent) => {
            const full = path.posix.join(target, d.name);
            try {
                const st = await fs.lstat(full);
                return {
                    name: d.name,
                    type: d.isDirectory() ? 'dir' : d.isFile() ? 'file' : 'other',
                    size: st.size,
                    mtimeMs: st.mtimeMs,
                };
            } catch {
                return {
                    name: d.name,
                    type: d.isDirectory() ? 'dir' : d.isFile() ? 'file' : 'other',
                    size: null,
                    mtimeMs: null,
                };
            }
        })
    );

    return {
        path: args.relPath ?? '',
        pageSize: args.pageSize,
        cursor: args.cursor,
        nextCursor: end < dirents.length ? end : null,
        total: dirents.length,
        entries,
    };
}
