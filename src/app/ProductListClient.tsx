"use client";
import { useEffect, useState } from "react";
import { useSearch } from "@src/context/SearchContext";
import ProductCard from "@src/components/ProductCard";
import Sidebar from "@src/components/Sidebar";
import ShimmerLoader from "@src/components/Shimmer";
import styles from "./page.module.scss";

type Props = {
  initialProducts: any[];
  initialTotal: number;
  initialQuery: string;
  initialSortBy: "title" | "price" | "rating";
  initialOrder: "asc" | "desc";
};

const LIMIT = 20;

export default function ProductListClient({ initialProducts, initialTotal, initialQuery, initialSortBy, initialOrder }: Props) {
  const { query } = useSearch();

  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [derivedPrice, setDerivedPrice] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(initialTotal || 0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<typeof initialSortBy>(initialSortBy);
  const [order, setOrder] = useState<typeof initialOrder>(initialOrder);

  // derive filters and price from current products
  useEffect(() => {
    const categorySet = new Set<string>();
    const brandSet = new Set<string>();
    let minP = Number.POSITIVE_INFINITY;
    let maxP = 0;
    (products || []).forEach((p) => {
      if (p.category) categorySet.add(p.category);
      if (p.brand) brandSet.add(p.brand);
      if (typeof p.price === "number") {
        if (p.price < minP) minP = p.price;
        if (p.price > maxP) maxP = p.price;
      }
    });
    setFilters({ category: Array.from(categorySet).sort(), brand: Array.from(brandSet).sort() });
    if (products.length > 0) {
      const nextMin = isFinite(minP) ? Math.floor(minP) : 0;
      const nextMax = maxP || 0;
      setDerivedPrice({ min: nextMin, max: nextMax });
      if (page === 0 && !priceRange.min && !priceRange.max) setPriceRange({ min: nextMin, max: nextMax });
    }
  }, [products]);

  const buildUrl = (searchTerm: string | undefined, pageNumber: number) => {
    const skip = pageNumber * LIMIT;
    const base = searchTerm
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`
      : `https://dummyjson.com/products`;
    const params = `limit=${LIMIT}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
    return `${base}?${params}`;
  };

  const skipHasMore = (receivedCount: number, pageNumber: number, totalCount: number) => {
    if (receivedCount < LIMIT) return false;
    const fetched = (pageNumber + 1) * LIMIT;
    return fetched < totalCount;
  };

  // initial sync if search query differs from initial
  useEffect(() => {
    const activeQuery = query || initialQuery || undefined;
    setLoading(true);
    setHasMore(true);
    setPage(0);
    fetch(buildUrl(activeQuery, 0))
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(typeof data.total === "number" ? data.total : (data.products || []).length);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortBy, order]);

  // infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          setLoadingMore(true);
          fetch(buildUrl(query || initialQuery || undefined, nextPage))
            .then((r) => r.json())
            .then((data) => {
              const nextProducts = data.products || [];
              setProducts((prev) => [...prev, ...nextProducts]);
              setHasMore(skipHasMore(nextProducts.length, nextPage, data.total ?? 0));
              setTotal(data.total ?? 0);
            })
            .finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: "200px" }
    );
    const el = document.getElementById("infinite-sentinel");
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore, loading, loadingMore, query, sortBy, order]);

  const visibleProducts = products.filter((p) => {
    const selCat = selectedFilters.category && selectedFilters.category.length > 0
      ? selectedFilters.category.includes(p.category)
      : true;
    const selBrand = selectedFilters.brand && selectedFilters.brand.length > 0
      ? selectedFilters.brand.includes(p.brand)
      : true;
    const inPrice = p.price >= (priceRange.min || 0) && (priceRange.max === 0 ? true : p.price <= priceRange.max);
    return selCat && selBrand && inPrice;
  });

  return (
    <>
      <Sidebar
        filters={filters}
        onFilterChange={(section, selected) => setSelectedFilters((prev) => ({ ...prev, [section]: selected }))}
        minPrice={derivedPrice.min}
        maxPrice={derivedPrice.max}
        priceRange={priceRange}
        onPriceChange={(min, max) => setPriceRange({ min, max })}
      />
      <div style={{ flex: 1 }}>
        <div className={styles.topBar}>
          <div className={styles.count}>Showing {visibleProducts.length} of {total}</div>
          <div className={styles.sortControls}>
            <label htmlFor="sortBy">Sort by</label>
            <select id="sortBy" className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
            <select className={styles.select} value={order} onChange={(e) => setOrder(e.target.value as any)}>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
        <div className={styles.productGrid}>
          {loading ? (
            <ShimmerLoader type="product" count={8} />
          ) : visibleProducts.length > 0 ? (
            visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No products found</p>
          )}
        </div>
        <div id="infinite-sentinel" style={{ height: 1 }} />
        {loadingMore && <div style={{ padding: 12 }}>Loading more…</div>}
      </div>
    </>
  );
}


