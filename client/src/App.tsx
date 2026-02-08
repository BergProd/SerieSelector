import { useEffect, useMemo, useState } from 'react';
import { createRoot, deleteRoot, getDestination, getRoots, listFiles, setDestination } from './api';
import type { FileEntry, Root, SelectionItem, SelectionRule } from './types';
import RootsPanel from './components/RootsPanel';
import DestinationPanel from './components/DestinationPanel';
import Toolbar from './components/Toolbar';
import FileTable from './components/FileTable';

const joinPath = (base: string, part: string) => {
  if (!base || base === '/') return part;
  return `${base.replace(/\/$/, '')}/${part}`;
};

export default function App() {
  const [roots, setRoots] = useState<Root[]>([]);
  const [activeRootId, setActiveRootId] = useState<string | null>(null);
  const [path, setPath] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [cursor, setCursor] = useState(0);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [destination, setDestinationState] = useState<{ rootId: string; relPath: string } | null>(null);
  const [selectionRules, setSelectionRules] = useState<SelectionRule[]>([]);
  const [selectionItems, setSelectionItems] = useState<SelectionItem[]>([]);

  const scopedRuleSelected = useMemo(() => {
    if (!activeRootId) return false;
    return selectionRules.some((r) => r.rootId === activeRootId && r.relPath === path && r.recursive);
  }, [activeRootId, path, selectionRules]);

  useEffect(() => {
    getRoots().then(setRoots).catch(() => setRoots([]));
    getDestination().then(setDestinationState).catch(() => setDestinationState(null));
  }, []);

  useEffect(() => {
    if (!activeRootId) return;
    setLoading(true);
    listFiles({ rootId: activeRootId, path, pageSize, cursor })
      .then((res) => {
        setEntries(res.entries);
        setTotal(res.total);
        setNextCursor(res.nextCursor);
      })
      .finally(() => setLoading(false));
  }, [activeRootId, path, pageSize, cursor]);

  const onCreateRoot = async (name: string, rootPath: string) => {
    const root = await createRoot({ name, path: rootPath });
    setRoots((prev) => [...prev, root]);
    setActiveRootId(root.id);
    setPath('');
    setCursor(0);
  };

  const onDeleteRoot = async (id: string) => {
    await deleteRoot(id);
    setRoots((prev) => prev.filter((r) => r.id !== id));
    if (activeRootId === id) {
      setActiveRootId(null);
      setPath('');
      setEntries([]);
    }
  };

  const onSelectRoot = (id: string) => {
    setActiveRootId(id);
    setPath('');
    setCursor(0);
  };

  const onSaveDestination = async (rootId: string, relPath: string) => {
    const saved = await setDestination(rootId, relPath);
    setDestinationState(saved);
  };

  const onOpenDir = (name: string) => {
    setPath((prev) => joinPath(prev, name));
    setCursor(0);
  };

  const onUp = () => {
    if (!path) return;
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    setPath(parts.join('/'));
    setCursor(0);
  };

  const onToggleAllScope = () => {
    if (!activeRootId) return;
    if (scopedRuleSelected) {
      setSelectionRules((prev) => prev.filter((r) => !(r.rootId === activeRootId && r.relPath === path)));
      return;
    }
    setSelectionRules((prev) => [...prev, { rootId: activeRootId, relPath: path, recursive: true }]);
  };

  const onToggleItem = (entry: FileEntry) => {
    if (!activeRootId) return;
    const relPath = joinPath(path, entry.name);
    const exists = selectionItems.some((s) => s.rootId === activeRootId && s.relPath === relPath);
    if (exists) {
      setSelectionItems((prev) => prev.filter((s) => !(s.rootId === activeRootId && s.relPath === relPath)));
      return;
    }
    setSelectionItems((prev) => [...prev, { rootId: activeRootId, relPath, type: entry.type }]);
  };

  const pageInfo = `${cursor + 1}-${Math.min(cursor + pageSize, total)} / ${total}`;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Pool Rescue Manager</h1>
          <p>Välj mappar att rädda från din TrueNAS-pool.</p>
        </div>
        <div className="status">
          <span className="dot" />
          {activeRootId ? 'Klar' : 'Välj root'}
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <RootsPanel
            roots={roots}
            activeRootId={activeRootId}
            onSelect={onSelectRoot}
            onCreate={onCreateRoot}
            onDelete={onDeleteRoot}
          />
          <DestinationPanel roots={roots} destination={destination} onSave={onSaveDestination} />
          <section className="panel">
            <div className="panel-header">
              <h3>Exportlista</h3>
              <p>Regler och val som ska flyttas senare.</p>
            </div>
            <div className="panel-body">
              {selectionRules.length === 0 && selectionItems.length === 0 && (
                <div className="muted">Ingen markering ännu.</div>
              )}
              {selectionRules.map((r, i) => (
                <div key={`${r.rootId}-${r.relPath}-${i}`} className="chip">
                  Rekursiv: {r.relPath || '/'}
                </div>
              ))}
              {selectionItems.map((i) => (
                <div key={`${i.rootId}-${i.relPath}`} className="chip">
                  {i.type}: {i.relPath}
                </div>
              ))}
            </div>
          </section>
        </aside>

        <main className="content">
          <div className="card">
            <Toolbar path={path} onUp={onUp} pageSize={pageSize} onPageSize={setPageSize} />
            <div className="meta">
              <div>{activeRootId ? `Root: ${activeRootId}` : 'Ingen root vald'}</div>
              <div>{loading ? 'Laddar…' : pageInfo}</div>
            </div>
            <FileTable
              entries={entries}
              selected={selectionItems}
              scopedRuleSelected={scopedRuleSelected}
              onToggleAllScope={onToggleAllScope}
              onToggleItem={onToggleItem}
              onOpenDir={onOpenDir}
            />
            <div className="pagination">
              <button className="btn btn-ghost" disabled={cursor === 0} onClick={() => setCursor(0)}>
                Första
              </button>
              <button className="btn btn-ghost" disabled={cursor === 0} onClick={() => setCursor(Math.max(0, cursor - pageSize))}>
                Föregående
              </button>
              <button className="btn btn-ghost" disabled={nextCursor === null} onClick={() => setCursor(nextCursor ?? cursor)}>
                Nästa
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
