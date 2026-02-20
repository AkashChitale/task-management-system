interface EmptyStateProps {
    message?: string;
}

const EmptyState = ({ message = "No todos yet." }: EmptyStateProps) => {
    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;