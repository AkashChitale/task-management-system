import "./FullPageStatus.css";

type FullPageStatusProps = {
  title: string;
  message: string;
};

export default function FullPageStatus({ title, message }: FullPageStatusProps) {
  return (
    <section className="fullpage-status" role="status" aria-live="polite" aria-busy="true">
      <div className="fullpage-status__card">
        <span className="fullpage-status__spinner" aria-hidden="true" />
        <h1 className="fullpage-status__title">{title}</h1>
        <p className="fullpage-status__message">{message}</p>
      </div>
    </section>
  );
}
