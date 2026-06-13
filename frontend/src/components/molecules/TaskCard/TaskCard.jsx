import { memo } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_ICONS } from "../../../constants/categories";
import Styles from "./TaskCard.module.css";

function TaskCard({ task }) {
  const {
    _id,
    title,
    description,
    category,
    isUrgent,
    requesterId,
  } = task;

  const iconClass = CATEGORY_ICONS[category] || "fa-solid fa-circle-question";

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className={`${Styles.card} card h-100`}>

        {/* ── Card Top Row: category icon + urgent badge ── */}
        <div className={`${Styles.cardTop} card-body pb-0`}>
          <div className="d-flex justify-content-between align-items-start">

            {/* Category icon in a small circle */}
            <div className={Styles.categoryIcon}>
              <i className={iconClass}></i>
            </div>

            {/* Urgent badge — only shows if isUrgent is true */}
            {isUrgent && (
              <span className={Styles.urgentBadge}>
                Urgent
              </span>
            )}
          </div>
        </div>

        {/* ── Card Body: title + description ── */}
        <div className="card-body pt-2 pb-2">
          <h5 className={Styles.cardTitle}>{title}</h5>
          <p className={Styles.cardDescription}>{description}</p>
        </div>

        {/* ── Card Footer: requester + Offer Help ── */}
        <div className={`${Styles.cardFooter} card-body pt-0`}>
          <div className="d-flex justify-content-between align-items-center">

            {/* Requester avatar + name */}
            <div className="d-flex align-items-center gap-2">
              {requesterId?.avatar ? (
                <img
                  src={`http://localhost:5000${requesterId.avatar}`}
                  alt={requesterId.name}
                  className={Styles.avatar}
                />
              ) : (
                // Fallback: show first letter of name if no avatar
                <div className={Styles.avatarFallback}>
                  {requesterId?.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <span className={Styles.requesterName}>
                {requesterId?.name}
              </span>
            </div>

            {/* Offer Help link — styled as text, not a button */}
            <Link
              to={`/requests/${_id}`}
              className={`${Styles.offerHelpLink} text-decoration-none`}
            >
              Offer Help
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}

// memo prevents re-rendering if the task prop hasn't changed
export default memo(TaskCard);