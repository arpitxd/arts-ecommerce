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
      <Gallery images={images} title={product.title} />
      <div className={styles.details}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>₹{product.price}</p>
        <p className={styles.discount}>Discount: {product.discountPercentage}%</p>
        <p className={styles.rating}>⭐ {product.rating}</p>
        <AddToCartButton product={product} />

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

        {/* Reviews */}
        {Array.isArray(product.reviews) && product.reviews.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Reviews</div>
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
