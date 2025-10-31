"use client";
import { useCart } from "@src/context/CartContext";
import styles from "./style.module.scss";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  return (
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
  );
}


