import React from "react";
import { PolicyProps } from "./type";
import styles from "../style.module.scss";

const Policy: React.FC<PolicyProps> = ({ product }) => {
    return (
        <>
            {(product.warrantyInformation || product.shippingInformation || product.returnPolicy) && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Policies</div>
                    {product.warrantyInformation && <div className={styles.metaRow}><span>Warranty</span><span>{product.warrantyInformation}</span></div>}
                    {product.shippingInformation && <div className={styles.metaRow}><span>Shipping</span><span>{product.shippingInformation}</span></div>}
                    {product.returnPolicy && <div className={styles.metaRow}><span>Returns</span><span>{product.returnPolicy}</span></div>}
                </div>
            )}
        </>
    );
}

export default Policy;