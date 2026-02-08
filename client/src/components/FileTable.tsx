import type { FileEntry, SelectionItem } from '../types';

type Props = {
  entries: FileEntry[];
  selected: SelectionItem[];
  scopedRuleSelected: boolean;
  onToggleAllScope: () => void;
  onToggleItem: (entry: FileEntry) => void;
  onOpenDir: (name: string) => void;
};

export default function FileTable({
  entries,
  selected,
  scopedRuleSelected,
  onToggleAllScope,
  onToggleItem,
  onOpenDir
}: Props) {
  const isSelected = (entry: FileEntry) =>
    selected.some((s) => s.relPath.endsWith(`/${entry.name}`) || s.relPath === entry.name);

  return (
    <div className="table">
      <div className="table-row header">
        <div className="cell checkbox">
          <input type="checkbox" checked={scopedRuleSelected} onChange={onToggleAllScope} />
        </div>
        <div className="cell name">Namn</div>
        <div className="cell type">Typ</div>
        <div className="cell size">Storlek</div>
        <div className="cell mtime">Senast ändrad</div>
        <div className="cell actions">Åtgärd</div>
      </div>

      {entries.map((e) => (
        <div className={`table-row ${e.type === 'dir' ? 'dir' : ''}`} key={`${e.type}-${e.name}`}>
          <div className="cell checkbox">
            <input
              type="checkbox"
              checked={scopedRuleSelected || isSelected(e)}
              onChange={() => onToggleItem(e)}
              disabled={scopedRuleSelected}
            />
          </div>
          <div className="cell name">
            <span className="file-icon">{e.type === 'dir' ? '📁' : '📄'}</span>
            {e.name}
          </div>
          <div className="cell type">{e.type}</div>
          <div className="cell size">{e.size ?? '-'}</div>
          <div className="cell mtime">
            {e.mtimeMs ? new Date(e.mtimeMs).toLocaleString() : '-'}
          </div>
          <div className="cell actions">
            {e.type === 'dir' && (
              <button className="btn btn-ghost" onClick={() => onOpenDir(e.name)}>
                Öppna
              </button>
            )}
          </div>
        </div>
      ))}

      {entries.length === 0 && <div className="empty">Inga filer i denna nivå.</div>}
    </div>
  );
}
