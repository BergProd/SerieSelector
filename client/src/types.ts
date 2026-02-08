export type FileEntry = {
  name: string;
  type: 'dir' | 'file' | 'other';
  size: number | null;
  mtimeMs: number | null;
};

export type ListResponse = {
  path: string;
  pageSize: number;
  cursor: number;
  nextCursor: number | null;
  total: number;
  entries: FileEntry[];
};

export type Root = {
  id: string;
  name: string;
  path: string;
};

export type DestinationSetting = {
  rootId: string;
  relPath: string;
} | null;

export type SelectionRule = {
  rootId: string;
  relPath: string;
  recursive: boolean;
};

export type SelectionItem = {
  rootId: string;
  relPath: string;
  type: 'file' | 'dir' | 'other';
};
