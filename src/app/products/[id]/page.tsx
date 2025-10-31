import styles from "./style.module.scss";
import Gallery from "./Gallery";
import AddToCartButton from "./AddToCartButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`https://dummyjson.com/products/${id}`, { cache: "no-store" });
  const p = await res.json();
  return {
    title: `${p.title} – ArtsStore`,
    description: p.description,
    openGraph: {
      title: p.title,
      description: p.description,
      images: p.thumbnail ? [p.thumbnail] : [],
    },
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`https://dummyjson.com/products/${id}`, { cache: "no-store" });
  const product = await res.json();
  const rawImages: string[] = Array.isArray(product.images) ? product.images : [];
  const images: string[] = [...rawImages, product.thumbnail]
    .filter((src) => typeof src === "string" && src.trim().length > 0);

  return (
    <div className={styles.productDetail}>
      <div className={styles.leftCol}>
        <Gallery images={images} title={product.title} />
        <div className={styles.leftActions}>
          <AddToCartButton product={product} />
        </div>
      </div>
      <div className={styles.details}>
        <h1 className={styles.title}>{product.title}</h1>
        <div className={styles.statsRow}>
          <span className={styles.ratingBadge}>⭐ {Number(product.rating || 0).toFixed(1)}</span>
          <span className={styles.muted}>{(product.reviews?.length || 0)} reviews</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price}</span>
          {product.meta?.priceBeforeDiscount && (
            <span className={styles.mrp}>₹{product.meta.priceBeforeDiscount}</span>
          )}
          {product.discountPercentage && (
            <span className={styles.offer}>{Math.round(product.discountPercentage)}% off</span>
          )}
        </div>

        <p className={styles.description}>{product.description}</p>

        {/* Availability */}
        {product.availabilityStatus && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Availability</div>
            <span className={styles.badge}>{product.availabilityStatus}</span>
          </div>
        )}

        {/* Meta info */}
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
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div className={styles.sectionTitle} style={{ marginBottom: 6 }}>Tags</div>
              <div className={styles.tags}>
                {product.tags.map((t: string) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Policies */}
        {(product.warrantyInformation || product.shippingInformation || product.returnPolicy) && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Policies</div>
            {product.warrantyInformation && <div className={styles.metaRow}><span>Warranty</span><span>{product.warrantyInformation}</span></div>}
            {product.shippingInformation && <div className={styles.metaRow}><span>Shipping</span><span>{product.shippingInformation}</span></div>}
            {product.returnPolicy && <div className={styles.metaRow}><span>Returns</span><span>{product.returnPolicy}</span></div>}
          </div>
        )}

        {/* Specifications */}
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

        {/* Reviews */}
        {Array.isArray(product.reviews) && product.reviews.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Reviews</div>
            {/* Ratings summary */}
            {(() => {
              const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
              let sum = 0;
              for (const r of product.reviews) {
                const rt = Math.max(1, Math.min(5, Math.round(r.rating || 0)));
                counts[rt] += 1;
                sum += r.rating || 0;
              }
              const total = product.reviews.length;
              const avg = total ? (sum / total) : 0;
              return (
                <div className={styles.ratingsSummary}>
                  <div className={styles.avgRating}>{avg.toFixed(1)}★</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[5,4,3,2,1].map((star) => {
                      const pct = total ? (counts[star] / total) * 100 : 0;
                      return (
                        <div key={star} className={styles.distRow}>
                          <span>{star}★</span>
                          <div className={styles.bar}><div className={styles.barFill} style={{ width: `${pct}%` }} /></div>
                          <span>{counts[star]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className={styles.reviews}>
              {product.reviews.map((r: any, idx: number) => (
                <div key={idx} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span>{r.reviewerName || r.reviewerEmail || "Anonymous"}</span>
                    <span>⭐ {r.rating}</span>
                  </div>
                  <div className={styles.reviewComment}>{r.comment}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
