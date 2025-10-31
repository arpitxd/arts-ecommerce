"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@src/context/CartContext";
import styles from "./style.module.scss";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    });
    // brief feedback, then navigate
    await new Promise((r) => setTimeout(r, 600));
    router.push("/cart");
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-disabled={busy}
      className={styles.addButton}
    >
      {busy ? "Going to cart…" : "Add to Cart"}
    </button>
  );
}


