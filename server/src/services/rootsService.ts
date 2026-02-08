import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export type Root = { id: string; name: string; path: string };
export type DestinationSetting = { rootId: string; relPath: string };

type Config = {
    roots: Root[];
    destination: DestinationSetting | null;
};

const CONFIG_PATH = path.resolve(process.cwd(), 'data', 'config.json');

async function readConfig(): Promise<Config> {
    try {
        const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<Config>;
        return {
            roots: Array.isArray(parsed.roots) ? (parsed.roots as Root[]) : [],
            destination: parsed.destination ?? null,
        };
    } catch {
        return { roots: [], destination: null };
    }
}

async function writeConfig(cfg: Config) {
    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf-8');
}

export async function getRoots() {
    return (await readConfig()).roots;
}

export async function getRootById(id: string) {
    const cfg = await readConfig();
    return cfg.roots.find((r) => r.id === id) ?? null;
}

export async function addRoot(name: string, rootPath: string) {
    const cfg = await readConfig();
    const root: Root = { id: crypto.randomUUID(), name, path: rootPath };
    cfg.roots.push(root);
    await writeConfig(cfg);
    return root;
}

export async function deleteRoot(id: string) {
    const cfg = await readConfig();
    const before = cfg.roots.length;
    cfg.roots = cfg.roots.filter((r) => r.id !== id);
    if (cfg.destination?.rootId === id) {
        cfg.destination = null;
    }
    await writeConfig(cfg);
    return cfg.roots.length !== before;
}

export async function getConfig() {
    return readConfig();
}

export async function saveConfig(cfg: Config) {
    await writeConfig(cfg);
}
