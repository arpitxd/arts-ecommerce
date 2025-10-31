"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.scss";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const validImages = (images || []).filter((src) => typeof src === "string" && src.trim().length > 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = validImages[activeIndex] ?? "";

  if (validImages.length === 0) {
    return (
      <div className={styles.imageContainer}>
        <div className={styles.mainImage}>
          <div style={{ width: 600, height: 600, background: "#f3f4f6", borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.imageContainer}>
      <div className={styles.thumbs}>
        {validImages.map((src, idx) => (
          <button
            key={src + idx}
            className={`${styles.thumb} ${idx === activeIndex ? styles.activeThumb : ""}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`View image ${idx + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={title} />
          </button>
        ))}
      </div>
      <div className={styles.mainImage}>
        {activeSrc ? (
          <Image
            src={activeSrc}
            alt={title}
            width={600}
            height={600}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            priority
          />
        ) : (
          <div style={{ width: 600, height: 600, background: "#f3f4f6", borderRadius: 12 }} />
        )}
      </div>
    </div>
  );
}


