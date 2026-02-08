import { useState } from 'react';
import type { Root } from '../types';

type Props = {
  roots: Root[];
  activeRootId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string, path: string) => void;
  onDelete: (id: string) => void;
};

export default function RootsPanel({ roots, activeRootId, onSelect, onCreate, onDelete }: Props) {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');

  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Root Mountpoints</h3>
        <p>Lägg till de mountpoints du vill jobba från.</p>
      </div>

      <div className="panel-body">
        <div className="form-row">
          <input
            className="input"
            placeholder="Namn (t.ex. Tank)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="/mnt/tank"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
          <button
            className="btn"
            onClick={() => {
              if (!name.trim() || !path.trim()) return;
              onCreate(name.trim(), path.trim());
              setName('');
              setPath('');
            }}
          >
            Lägg till
          </button>
        </div>

        <div className="list">
          {roots.length === 0 && <div className="muted">Inga roots ännu.</div>}
          {roots.map((root) => (
            <div key={root.id} className={`list-row ${root.id === activeRootId ? 'active' : ''}`}>
              <button className="link" onClick={() => onSelect(root.id)}>
                <div className="title">{root.name}</div>
                <div className="subtitle">{root.path}</div>
              </button>
              <button className="btn btn-ghost" onClick={() => onDelete(root.id)}>
                Ta bort
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
