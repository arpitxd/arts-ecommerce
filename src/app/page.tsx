import ProductListClient from "./ProductListClient";
import styles from "./page.module.scss";

export const metadata = {
  title: "ArtsStore – Products",
  description: "Browse products with filters, sorting, and infinite scroll.",
};

const LIMIT = 20;

async function fetchInitialProducts(q: string | undefined, sortBy: string, order: string) {
  const base = q
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`
    : `https://dummyjson.com/products`;
  const params = `limit=${LIMIT}&skip=0&sortBy=${sortBy}&order=${order}`;
  const res = await fetch(`${base}?${params}`, { cache: "no-store" });
  const data = await res.json();
  return data;
}

export default async function Home({ searchParams }: { searchParams?: { q?: string; sortBy?: string; order?: string } }) {
  const initialQuery = searchParams?.q || "";
  const initialSortBy = (searchParams?.sortBy as "title" | "price" | "rating") || "title";
  const initialOrder = (searchParams?.order as "asc" | "desc") || "asc";

  const data = await fetchInitialProducts(initialQuery || undefined, initialSortBy, initialOrder);
  const initialProducts = Array.isArray(data?.products) ? data.products : [];
  const total = typeof data?.total === "number" ? data.total : initialProducts.length;

  return (
    <div className={styles.wrapper}>
      <ProductListClient
        initialProducts={initialProducts}
        initialTotal={total}
        initialQuery={initialQuery}
        initialSortBy={initialSortBy}
        initialOrder={initialOrder}
      />
    </div>
  );
}
