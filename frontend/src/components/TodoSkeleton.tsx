const TodoSkeleton = () => {
  return (
    <ul>
      {[1, 2, 3].map((i) => (
        <li
          key={i}
          style={{
            height: "16px",
            marginBottom: "8px",
            backgroundColor: "#e5e7eb",
            borderRadius: "4px",
          }}
        />
      ))}
    </ul>
  );
};

export default TodoSkeleton;