"use client";
import Link from "next/link";
import { useCart } from "@src/context/CartContext";
import styles from "./style.module.scss";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Arts<span style={{ color: "#2563eb" }}>Store</span>
        </Link>
        <Link href="/cart" className={styles.cart}>
          🛒
          <span className={styles.badge}>{cartCount}</span>
        </Link>
      </div>
    </header>
  );
}
