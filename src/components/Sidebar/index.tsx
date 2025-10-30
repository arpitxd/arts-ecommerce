"use client";
import { useState } from "react";
import styles from "./style.module.scss";

export default function Sidebar({ onFilterChange, onSortChange }: any) {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    onFilterChange(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    onSortChange(e.target.value);
  };

  return (
    <aside className={styles.sidebar}>
      <span className={styles.filterTitle}>Filters</span>
      <div className={styles.section}>
        <label>Category</label>
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All</option>
          <option value="beauty">Beauty</option>
          <option value="fragrances">Fragrances</option>
          <option value="furniture">Furniture</option>
          <option value="groceries">Groceries</option>
          <option value="laptops">Laptops</option>
        </select>
      </div>

      <span className={styles.filterTitle}>Sort By</span>
      <div className={styles.section}>
        <label>Sort</label>
        <select value={sort} onChange={handleSortChange}>
          <option value="">Default</option>
          <option value="price-low-high">Price: Low → High</option>
          <option value="price-high-low">Price: High → Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </aside>
  );
}
