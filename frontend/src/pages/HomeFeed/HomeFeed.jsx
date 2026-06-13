import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useFetchTasksQuery } from "../../features/tasks/tasksSlice";
import TaskCard from "../../components/molecules/TaskCard/TaskCard";
import TaskCardSkeleton from "../../components/molecules/TaskCard/TaskCardSkeleton";
import { CATEGORIES, CATEGORY_ICONS } from "../../constants/categories";
import Styles from "./HomeFeed.module.css";

export default function HomeFeed() {
  const { user } = useSelector((state) => state.auth);

  // Track which category pill is selected
  const [activeCategory, setActiveCategory] = useState("");

  // Track the search input value
  const [search, setSearch] = useState("");

  // Fetch tasks — RTK Query automatically refetches when these change
  const { data, isLoading, isError } = useFetchTasksQuery({
    category: activeCategory,
    search,
    page: 1,
    limit: 9,
  });

  // useMemo: only re-compute this list when data changes
  // Prevents unnecessary re-calculations on every render
  const tasks = useMemo(() => data?.data ?? [], [data]);

  const handleCategoryClick = (cat) => {
    // If clicking the already-active category, deselect it (show all)
    setActiveCategory((prev) => (prev === cat ? "" : cat));
  };

  return (
    <div className={Styles.pageWrapper}>

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav className={Styles.navbar}>
        {/* Left: grid/menu icon */}
        <button className={Styles.menuBtn}>
          <i className="fa-solid fa-grip"></i>
        </button>

        {/* Center: brand */}
        <span className={Styles.brand}>HELPHIVE</span>

        {/* Right: user avatar */}
        <div className={Styles.navAvatar}>
          {user?.avatar ? (
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt={user.name}
              className={Styles.navAvatarImg}
            />
          ) : (
            <div className={Styles.navAvatarFallback}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          CONTENT AREA
      ══════════════════════════════════════════ */}
      <div className={Styles.content}>

        {/* ── Search Bar ── */}
        <div className={Styles.searchWrapper}>
          <i className={`fa-solid fa-magnifying-glass ${Styles.searchIcon}`}></i>
          <input
            type="text"
            className={Styles.searchInput}
            placeholder="What do you need help with?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Filter icon on the right */}
          <button className={Styles.filterBtn}>
            <i className="fa-solid fa-sliders"></i>
          </button>
        </div>

        {/* ── Category Filter Pills ── */}
        <div className={Styles.categoryRow}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`${Styles.categoryBtn} ${isActive ? Styles.categoryBtnActive : ""}`}
              >
                {/* Icon circle */}
                <div className={`${Styles.categoryIconCircle} ${isActive ? Styles.categoryIconCircleActive : ""}`}>
                  <i className={CATEGORY_ICONS[cat]}></i>
                </div>
                {/* Label below icon */}
                <span className={Styles.categoryLabel}>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* ── Section Title ── */}
        <h2 className={Styles.sectionTitle}>Nearby Help Requests</h2>

        {/* ── Task Grid ── */}
        {isError && (
          <div className="alert alert-danger rounded-4">
            Something went wrong. Please refresh the page.
          </div>
        )}

        <div className="row">
          {/* Skeleton cards while loading */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}

          {/* Actual task cards */}
          {!isLoading &&
            tasks.map((task) => <TaskCard key={task._id} task={task} />)}

          {/* Empty state */}
          {!isLoading && tasks.length === 0 && (
            <div className={Styles.emptyState}>
              <div className={Styles.emptyIcon}>🐝</div>
              <h5>No tasks found</h5>
              <p>Try a different category or search term.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}