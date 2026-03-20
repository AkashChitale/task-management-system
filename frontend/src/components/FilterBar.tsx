import "./FilterBar.css";

export type FilterType = "all" | "active" | "completed" | "today" | "overdue";

interface Props {
  activeFilter: FilterType;
  onChange: (filter: FilterType) => void;
}

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Today", value: "today" },
  { label: "Overdue", value: "overdue" },
];

export default function FilterBar({ activeFilter, onChange }: Props) {
  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f.value}
          className={`filter-btn ${
            activeFilter === f.value ? "active" : ""
          }`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}