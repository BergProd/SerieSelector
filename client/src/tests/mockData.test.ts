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

describe('mock data (client)', () => {
  it('has at least one root', () => {
    const mock = loadMock();
    expect(mock.roots.length).toBeGreaterThan(0);
  });

  it('contains file entries in mock tree', () => {
    const mock = loadMock();
    const root = mock.tree['root-tank'];
    const entries = root?.['Movies'] ?? [];
    expect(entries.some((e) => e.type === 'file')).toBe(true);
  });
});
