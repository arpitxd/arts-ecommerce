import React from "react";
import { ReviewsProps } from "./types";
import styles from "../style.module.scss";

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
    if (!(Array.isArray(reviews) && reviews.length > 0)) return null;

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>Reviews</div>
            {/* Ratings summary */}
            {(() => {
                const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
                let sum = 0;
                for (const r of reviews) {
                    const rt = Math.max(1, Math.min(5, Math.round(r.rating || 0)));
                    counts[rt] += 1;
                    sum += r.rating || 0;
                }
                const total = reviews.length;
                const avg = total ? (sum / total) : 0;
                return (
                    <div className={styles.ratingsSummary}>
                        <div className={styles.avgRating}>{avg.toFixed(1)}★</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const pct = total ? (counts[star] / total) * 100 : 0;
                                return (
                                    <div key={star} className={styles.distRow}>
                                        <span>{star}★</span>
                                        <div className={styles.bar}><div className={styles.barFill} style={{ width: `${pct}%` }} /></div>
                                        <span>{counts[star]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            <div className={styles.reviews}>
                {reviews.map((r: any, idx: number) => (
                    <div key={idx} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                            <span>{r.reviewerName || r.reviewerEmail || "Anonymous"}</span>
                            <span>⭐ {r.rating}</span>
                        </div>
                        <div className={styles.reviewComment}>{r.comment}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reviews;