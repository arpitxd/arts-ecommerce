"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

export default function ProductCard({ product }: { product: any }) {
  const thumbnail = typeof product?.thumbnail === "string" ? product.thumbnail : "";
  const images: string[] = Array.isArray(product?.images)
    ? product.images.filter(
        (src, idx, arr) =>
          typeof src === "string" && src.trim().length > 0 && arr.indexOf(src) === idx
      )
    : [];

  const [currentSrc, setCurrentSrc] = useState<string>(thumbnail);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when product changes
  useEffect(() => {
    setCurrentSrc(thumbnail);
    setCurrentIndex(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [product?.id]);

  const handleEnter = () => {
    if (images.length <= 1) return; // nothing to slide
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        setCurrentSrc(images[next]);
        return next;
      });
    }, 1500);
  };

  const handleLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentIndex(0);
    setCurrentSrc(thumbnail);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={styles.card}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className={styles.imageWrapper}>
        {currentSrc ? (
          <Image
            src={currentSrc}
            alt={product.title}
            width={300}
            height={200}
            className={styles.image}
            unoptimized
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}

        {/* Dots appear only on hover */}
        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === currentIndex ? styles.active : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.rating}>⭐ {product.rating}</p>
        <p className={styles.price}>₹{product.price}</p>
      </div>
    </Link>
  );
}
