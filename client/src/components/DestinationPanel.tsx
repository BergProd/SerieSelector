import { useEffect, useState } from 'react';
import type { DestinationSetting, Root } from '../types';

type Props = {
  roots: Root[];
  destination: DestinationSetting;
  onSave: (rootId: string, relPath: string) => void;
};

export default function DestinationPanel({ roots, destination, onSave }: Props) {
  const [rootId, setRootId] = useState(destination?.rootId ?? '');
  const [relPath, setRelPath] = useState(destination?.relPath ?? '');

  useEffect(() => {
    setRootId(destination?.rootId ?? '');
    setRelPath(destination?.relPath ?? '');
  }, [destination?.rootId, destination?.relPath]);

  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Destination</h3>
        <p>Välj mål-root och en relativ sökväg där exporten skapas.</p>
      </div>
      <div className="panel-body">
        <div className="form-row">
          <select className="select" value={rootId} onChange={(e) => setRootId(e.target.value)}>
            <option value="">Välj root</option>
            {roots.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="/rescue/2026-02-08"
            value={relPath}
            onChange={(e) => setRelPath(e.target.value)}
          />
          <button
            className="btn"
            disabled={!rootId}
            onClick={() => onSave(rootId, relPath.trim())}
          >
            Spara
          </button>
        </div>
        {destination && (
          <div className="muted small">
            Nuvarande: {destination.rootId} / {destination.relPath || '.'}
          </div>
        )}
      </div>
    </section>
  );
}
