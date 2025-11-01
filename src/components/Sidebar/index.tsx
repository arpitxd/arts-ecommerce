"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import FilterSection from "./FilterSection";
import { SidebarProps } from "./types";

export default function Sidebar({ filters, onFilterChange, minPrice = 0, maxPrice = 0, priceRange, onPriceChange }: SidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [min, setMin] = useState<number>(priceRange?.min ?? minPrice ?? 0);
  const [max, setMax] = useState<number>(priceRange?.max ?? maxPrice ?? 0);
  const [priceDirty, setPriceDirty] = useState(false);

  // keep local range in sync with props updates
  useEffect(() => {
    const nextMin = (priceRange && typeof priceRange.min === "number" && priceRange.min > 0)
      ? priceRange.min
      : minPrice;
    const nextMax = (priceRange && typeof priceRange.max === "number" && priceRange.max > 0)
      ? priceRange.max
      : maxPrice;
    if (Number.isFinite(nextMin) && Number.isFinite(nextMax)) {
      setMin(nextMin);
      setMax(nextMax);
    }
  }, [priceRange?.min, priceRange?.max, minPrice, maxPrice]);
  

  const handleChange = (section: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[section] || [];
      if (value === "CLEAR_ALL") {
        onFilterChange(section, []); // clear all
        return { ...prev, [section]: [] };
      }

      const exists = current.includes(value);
      const updated = exists
        ? current.filter((v) => v !== value)
        : [...current, value];

      onFilterChange(section, updated);
      return { ...prev, [section]: updated };
    });
  };

  const anySelected = Object.values(selectedFilters).some((v) => (v?.length || 0) > 0);
  const priceDiffers = (min !== minPrice || max !== maxPrice);

  return (
    <aside className={styles.sidebar}>
      {/* Selected chips (only when some filter is active) */}
      {(anySelected || (priceDirty && priceDiffers)) && (
        <>
          <div className={styles.chipsHeader}>
            <span className={styles.chipsTitle}>Filters</span>
            {(anySelected || (priceDirty && priceDiffers)) && (
              <span
                className={styles.clearLink}
                onClick={() => {
                  // clear all section filters
                  const keys = Object.keys(selectedFilters);
                  keys.forEach((k) => onFilterChange(k, []));
                  setSelectedFilters({});
                  // reset price only if it was changed
                  if (priceDirty) {
                    setMin(minPrice);
                    setMax(maxPrice);
                    onPriceChange && onPriceChange(minPrice, maxPrice);
                    setPriceDirty(false);
                  }
                }}
              >
                CLEAR ALL
              </span>
            )}
          </div>
          <div className={styles.chipsWrap}>
            {/* price chip - only after user interaction */}
            {priceDirty && priceDiffers && (
              <span className={styles.chip}>
                {`${min}-${max === maxPrice ? `${max}+` : max}`}
                <button
                  aria-label="clear price"
                  onClick={() => {
                    setMin(minPrice);
                    setMax(maxPrice);
                    onPriceChange && onPriceChange(minPrice, maxPrice);
                    setPriceDirty(false);
                  }}
                >
                  ✕
                </button>
              </span>
            )}

            {Object.entries(selectedFilters).flatMap(([section, values]) =>
              values.map((val) => (
                <span key={`${section}:${val}`} className={styles.chip}>
                  {val}
                  <button
                    aria-label={`remove ${val}`}
                    onClick={() => handleChange(section, val)}
                  >
                    ✕
                  </button>
                </span>
              ))
            )}
          </div>
        </>
      )}

      {/* Price Filter */}
      <div className={styles.filterGroup}>
        <div className={styles.filterHeader} onClick={() => {}}>
          <span>Price</span>
        </div>
        <div className={styles.filterBody}>
          <div className={styles.priceBox}>
            <div className={styles.rangeRow}>
              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  value={min}
                  min={minPrice}
                  max={max}
                  onChange={(e) => {
                    let v = Number(e.target.value);
                    if (!Number.isFinite(v)) v = minPrice;
                    if (v < minPrice) v = minPrice;
                    if (v > max) v = max;
                    setMin(v);
                    onPriceChange && onPriceChange(v, max);
                    setPriceDirty(true);
                  }}
                />
                <span>-</span>
                <input
                  type="number"
                  value={max}
                  min={min}
                  max={maxPrice || 10000}
                  onChange={(e) => {
                    let v = Number(e.target.value);
                    if (!Number.isFinite(v)) v = maxPrice;
                    if (v > (maxPrice || v)) v = maxPrice || v;
                    if (v < min) v = min;
                    setMax(v);
                    onPriceChange && onPriceChange(min, v);
                    setPriceDirty(true);
                  }}
                />
              </div>
            </div>
            <div className={styles.sliderWrap}>
              {(() => {
                const span = Math.max((maxPrice || 0) - (minPrice || 0), 1);
                const leftPct = span > 0 ? ((min - (minPrice || 0)) / span) * 100 : 0;
                const rightPct = span > 0 ? ((max - (minPrice || 0)) / span) * 100 : 0;
                return (
                  <div className={styles.dualSlider}>
                    <div className={styles.track} />
                    <div
                      className={styles.range}
                      style={{ left: `${Math.min(leftPct, rightPct)}%`, width: `${Math.abs(rightPct - leftPct)}%` }}
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice || 10000}
                      value={min}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v <= max) {
                          setMin(v);
                          onPriceChange && onPriceChange(v, max);
                          setPriceDirty(true);
                        }
                      }}
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice || 10000}
                      value={max}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= min) {
                          setMax(v);
                          onPriceChange && onPriceChange(min, v);
                          setPriceDirty(true);
                        }
                      }}
                    />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      {Object.keys(filters).map((filterKey) => (
        <FilterSection
          key={filterKey}
          title={filterKey}
          options={filters[filterKey]}
          selected={selectedFilters[filterKey] || []}
          onChange={handleChange}
        />
      ))}
    </aside>
  );
}
