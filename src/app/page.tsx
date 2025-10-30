"use client";
import { useEffect, useState } from "react";
import ProductCard from "@src/components/ProductCard";
import Sidebar from "@src/components/Sidebar";
import styles from "./page.module.scss";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setFiltered(data.products);
      });
  }, []);

  const handleFilter = (category: string) => {
    if (!category) return setFiltered(products);
    const result = products.filter((p) => p.category === category);
    setFiltered(result);
  };

  const handleSort = (sortType: string) => {
    let sorted = [...filtered];
    if (sortType === "price-low-high") sorted.sort((a, b) => a.price - b.price);
    else if (sortType === "price-high-low") sorted.sort((a, b) => b.price - a.price);
    else if (sortType === "rating") sorted.sort((a, b) => b.rating - a.rating);
    setFiltered(sorted);
  };
  const handlePriceChange = (range: [number, number]) => {
    const [min, max] = range;
    const result = products.filter((p) => p.price >= min && p.price <= max);
    setFiltered(result);
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar onFilterChange={handleFilter} onSortChange={handleSort} onPriceChange={handlePriceChange}/>
      </div>
      <div className={styles.productGrid}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>

  );
}
