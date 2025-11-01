import React from "react";
import { DetailsProps } from "./types";
import styles from "../style.module.scss";

const Details: React.FC<DetailsProps> = ({ product }) => {

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>Product details</div>
            <div className={styles.metaGrid}>
                {product.brand && (
                    <div className={styles.metaRow}><span>Brand</span><span>{product.brand}</span></div>
                )}
                {product.sku && (
                    <div className={styles.metaRow}><span>SKU</span><span>{product.sku}</span></div>
                )}
                {product.weight != null && (
                    <div className={styles.metaRow}><span>Weight</span><span>{product.weight} g</span></div>
                )}
                {product.dimensions && (
                    <div className={styles.metaRow}><span>Dimensions</span><span>{product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth}</span></div>
                )}
            </div>
        </div>
    );
}

export default Details;