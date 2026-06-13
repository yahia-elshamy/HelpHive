import Styles from "./TaskCard.module.css";

export default function TaskCardSkeleton() {
  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className={`${Styles.card} card h-100 p-3`} aria-hidden="true">

        {/* Icon placeholder */}
        <div className="d-flex justify-content-between mb-3">
          <div
            className="rounded-circle bg-secondary placeholder"
            style={{ width: 40, height: 40, opacity: 0.15 }}
          ></div>
        </div>

        {/* Title placeholder */}
        <div className="placeholder-glow mb-2">
          <span className="placeholder col-8 rounded" style={{ height: 18 }}></span>
        </div>

        {/* Description placeholder */}
        <div className="placeholder-glow mb-3">
          <span className="placeholder col-12 rounded mb-1" style={{ height: 13 }}></span>
          <span className="placeholder col-9 rounded" style={{ height: 13 }}></span>
        </div>

        {/* Footer placeholder */}
        <div
          className="d-flex justify-content-between align-items-center pt-3"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <div className="d-flex align-items-center gap-2 placeholder-glow">
            <span
              className="rounded-circle placeholder"
              style={{ width: 28, height: 28, opacity: 0.15 }}
            ></span>
            <span className="placeholder col-4 rounded" style={{ height: 13 }}></span>
          </div>
          <span className="placeholder col-3 rounded" style={{ height: 13 }}></span>
        </div>

      </div>
    </div>
  );
}