"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@src/context/CartContext";
import styles from "./style.module.scss";

export default function ProductDetail() {
  const params = useParams();
  const id = (params as { id: string }).id;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className={styles.productDetail}>
      <div className={styles.imageContainer}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={400}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      </div>

      <div className={styles.details}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>₹{product.price}</p>
        <p className={styles.discount}>
          Discount: {product.discountPercentage}%
        </p>
        <p className={styles.rating}>⭐ {product.rating}</p>

        <button
          onClick={() =>
            addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
              quantity: 1,
            })
          }
          className={styles.addButton}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
