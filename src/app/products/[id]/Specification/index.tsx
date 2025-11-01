import React from "react";
import styles from "../style.module.scss";
import { SpecificationProps } from "./type";

const Specification: React.FC<SpecificationProps> = ({ product }) => {

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>Specifications</div>
            <div className={styles.specsTable}>
                <div className={styles.specLabel}>Brand</div>
                <div className={styles.specValue}>{product.brand || "-"}</div>

                <div className={styles.specLabel}>Model</div>
                <div className={styles.specValue}>{product.title || "-"}</div>

                <div className={styles.specLabel}>Category</div>
                <div className={styles.specValue}>{product.category || "-"}</div>

                <div className={styles.specLabel}>SKU</div>
                <div className={styles.specValue}>{product.sku || "-"}</div>

                <div className={styles.specLabel}>Weight</div>
                <div className={styles.specValue}>{product.weight != null ? `${product.weight} g` : "-"}</div>

                {product.dimensions && (
                    <>
                        <div className={styles.specLabel}>Dimensions</div>
                        <div className={styles.specValue}>{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}</div>
                    </>
                )}

                {product.minimumOrderQuantity != null && (
                    <>
                        <div className={styles.specLabel}>Min Order Qty</div>
                        <div className={styles.specValue}>{product.minimumOrderQuantity}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Specification;