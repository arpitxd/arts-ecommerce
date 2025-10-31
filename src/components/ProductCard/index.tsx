import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.scss";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      {product?.thumbnail ? (
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={200}
          className={styles.image}
        />
      ) : (
        <div className={styles.image} style={{ background: "#f3f4f6", height: 200 }} />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.rating}>⭐ {product.rating}</p>
        <p className={styles.price}>₹{product.price}</p>
      </div>
    </Link>
  );
}
