import styles from "./style.module.scss";
import Gallery from "./Gallery";
import AddToCartButton from "./AddToCartButton";
import Specification from "./Specification";
import Reviews from "./Reviews";
import Policy from "./Policy";
import Details from "./Details";
import Information from "./Information";

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
        <Information product={product} />

        {/* Availability */}
        {product.availabilityStatus && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Availability</div>
            <span className={styles.badge}>{product.availabilityStatus}</span>
          </div>
        )}

        {/* Meta info */}
        <Details product={product} />
        
        {/* Policies */}
        <Policy product={product} />
       
        {/* Specifications */}
        <Specification product={product} />

        {/* Reviews */}
        <Reviews reviews={product?.reviews} />
      </div>
    </div>
  );
}
