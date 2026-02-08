type Props = {
  path: string;
  onUp: () => void;
  pageSize: number;
  onPageSize: (value: number) => void;
};

export default function Toolbar({ path, onUp, pageSize, onPageSize }: Props) {
  return (
    <div className="toolbar">
      <div className="breadcrumbs">
        <span className="pill">{path || '/'}</span>
      </div>
      <div className="toolbar-actions">
        <button className="btn btn-ghost" onClick={onUp}>
          Upp en nivå
        </button>
        <select className="select" value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))}>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}
