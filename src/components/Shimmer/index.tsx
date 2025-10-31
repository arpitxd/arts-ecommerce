import styles from "./style.module.scss";

export default function ShimmerLoader({
  type = "product",
  count = 6,
}: {
  type?: "product" | "sidebar";
  count?: number;
}) {
  if (type === "sidebar") {
    // Sidebar skeleton
    return (
      <div className={styles.sidebarLoader}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.sidebarBlock}></div>
        ))}
      </div>
    );
  }

  // Product grid skeletons
  return (
    <div className={styles.shimmerGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.image}></div>
          <div className={styles.textLine}></div>
          <div className={styles.textLineShort}></div>
        </div>
      ))}
    </div>
  );
}
