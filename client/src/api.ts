import type { DestinationSetting, ListResponse, Root } from './types';

type ListArgs = {
  rootId: string;
  path: string;
  pageSize: number;
  cursor: number;
};

export async function listFiles(args: ListArgs): Promise<ListResponse> {
  const params = new URLSearchParams({
    rootId: args.rootId,
    path: args.path,
    pageSize: String(args.pageSize),
    cursor: String(args.cursor)
  });

  const res = await fetch(`/api/files?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to list directory');
  return res.json();
}

export async function getRoots(): Promise<Root[]> {
  const res = await fetch('/api/roots');
  if (!res.ok) throw new Error('Failed to load roots');
  const data = await res.json();
  return data.roots ?? [];
}

export async function createRoot(payload: { name: string; path: string }): Promise<Root> {
  const res = await fetch('/api/roots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create root');
  return res.json();
}

export async function deleteRoot(rootId: string): Promise<void> {
  const res = await fetch(`/api/roots/${rootId}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete root');
}

export async function getDestination(): Promise<DestinationSetting> {
  const res = await fetch('/api/settings/destination');
  if (!res.ok) throw new Error('Failed to get destination');
  return res.json();
}

export async function setDestination(rootId: string, relPath: string): Promise<DestinationSetting> {
  const res = await fetch('/api/settings/destination', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rootId, relPath })
  });
  if (!res.ok) throw new Error('Failed to update destination');
  return res.json();
}
