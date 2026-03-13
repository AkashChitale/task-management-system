import { useState, useRef, useEffect } from "react";
import "./AddTodo.css";

type Todo = {
  title: string;
  desc: string;
  dueDate: string;
  completed: boolean;
};

type AddTodoProps = {
  onAdd: (todo: Todo) => void;
};

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [expanded, setExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // collapse on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAdd = () => {
    if (!title.trim()) return;

    onAdd({
      title,
      desc,
      dueDate: `${date} ${time}`,
      completed: false,
    });

    setTitle("");
    setDesc("");
    setDate("");
    setTime("");
    setExpanded(false);
  };

  return (
        <div
            ref={containerRef}
            className={`addtodo-container ${expanded ? "expanded" : ""}`}
        >
            <div className="addtodo-main-row">
            <input
                className="addtodo-title"
                placeholder="Add a task"
                value={title}
                onFocus={() => setExpanded(true)}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />

            {expanded && (
                <>
                <input
                    type="date"
                    className="addtodo-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <input
                    type="time"
                    className="addtodo-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />

                <button className="addtodo-btn" onClick={handleAdd}>
                    +
                </button>
                </>
            )}
            </div>

            {expanded && (
            <input
                className="addtodo-desc"
                placeholder="Description (optional)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
            )}
        </div>
        );
}