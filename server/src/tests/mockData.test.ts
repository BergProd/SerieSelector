import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

const loadMock = () => {
  const filePath = path.resolve(__dirname, '../../../shared/mockData.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as {
    roots: Array<{ id: string; name: string; path: string }>;
    tree: Record<string, Record<string, Array<{ name: string; type: string }>>>;
  };
};

const listFromMock = (rootId: string, relPath: string) => {
  const mock = loadMock();
  const root = mock.tree[rootId] ?? {};
  return root[relPath] ?? [];
};

describe('mock data (server)', () => {
  it('contains roots', () => {
    const mock = loadMock();
    expect(mock.roots.length).toBeGreaterThan(0);
  });

  it('lists root level entries', () => {
    const entries = listFromMock('root-tank', '');
    expect(entries.some((e) => e.name === 'Movies')).toBe(true);
  });

  it('lists nested entries', () => {
    const entries = listFromMock('root-tank', 'Series/TheExpanse');
    expect(entries[0]?.name).toBe('S01E01.mkv');
  });
});
