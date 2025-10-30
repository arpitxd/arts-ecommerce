"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./style.module.scss";

export default function Sidebar({
    onFilterChange,
    onSortChange,
    onPriceChange,
}: {
    onFilterChange: (category: string) => void;
    onSortChange: (sortType: string) => void;
    onPriceChange: (range: [number, number]) => void;
}) {
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(100000);

    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);

    // update colored track
    useEffect(() => {
        if (minValRef.current && maxValRef.current && range.current) {
            const min = Math.min(minVal, maxVal);
            const max = Math.max(minVal, maxVal);
            const percent1 = (min / 100000) * 100;
            const percent2 = (max / 100000) * 100;
            range.current.style.left = `${percent1}%`;
            range.current.style.width = `${percent2 - percent1}%`;
        }
    }, [minVal, maxVal]);

    const handlePriceChange = (min: number, max: number) => {
        const low = Math.min(min, max);
        const high = Math.max(min, max);
        onPriceChange([low, high]);
    };

    return (
        <aside className={styles.sidebar}>
            <span className={styles.filterTitle}>Filters</span>

            <div className={styles.section}>
                <label>Category</label>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        onFilterChange(e.target.value);
                    }}
                >
                    <option value="">All</option>
                    <option value="beauty">Beauty</option>
                    <option value="fragrances">Fragrances</option>
                    <option value="furniture">Furniture</option>
                    <option value="groceries">Groceries</option>
                    <option value="laptops">Laptops</option>
                </select>
            </div>

            {/* ---- PRICE RANGE ---- */}
            <div className={styles.section}>
                <label>Price Range</label>
                <div className={styles.priceRange}>
                    <div className={styles.values}>
                        <span>₹{minVal}</span>
                        <span>₹{maxVal}</span>
                    </div>
                    <div className={styles.sliderContainer}>
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            value={minVal}
                            ref={minValRef}
                            onChange={(e) => {
                                const val = Math.min(Number(e.target.value), maxVal - 500);
                                setMinVal(val);
                                handlePriceChange(val, maxVal);
                            }}
                            className={`${styles.thumb} ${styles.thumbLeft}`}
                        />

                        <input
                            type="range"
                            min="0"
                            max="100000"
                            value={maxVal}
                            ref={maxValRef}
                            onChange={(e) => {
                                const val = Math.max(Number(e.target.value), minVal + 500);
                                setMaxVal(val);
                                handlePriceChange(minVal, val);
                            }}
                            className={`${styles.thumb} ${styles.thumbRight}`}
                        />

                        <div className={styles.sliderTrack} />
                        <div ref={range} className={styles.sliderRange} />
                    </div>
                </div>
            </div>

            <span className={styles.filterTitle}>Sort By</span>
            <div className={styles.section}>
                <label>Sort</label>
                <select
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        onSortChange(e.target.value);
                    }}
                >
                    <option value="">Default</option>
                    <option value="price-low-high">Price: Low → High</option>
                    <option value="price-high-low">Price: High → Low</option>
                    <option value="rating">Rating</option>
                </select>
            </div>
        </aside>
    );
}
