import React from "react";

import styles from "../style.module.scss";
import { InformationProps } from "./type";
const Information: React.FC<InformationProps> = ({ product }) => {

    return (<>
        <h1 className={styles.title}>{product.title}</h1>
        <div className={styles.statsRow}>
            <span className={styles.ratingBadge}>⭐ {Number(product.rating || 0).toFixed(1)}</span>
            <span className={styles.muted}>{(product.reviews?.length || 0)} reviews</span>
        </div>

        <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price}</span>
            {product.meta?.priceBeforeDiscount && (
                <span className={styles.mrp}>₹{product.meta.priceBeforeDiscount}</span>
            )}
            {product.discountPercentage && (
                <span className={styles.offer}>{Math.round(product.discountPercentage)}% off</span>
            )}
        </div>

        <p className={styles.description}>{product.description}</p>
    </>)
}

export default Information;