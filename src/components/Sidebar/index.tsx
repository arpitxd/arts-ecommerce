"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

type SidebarProps = {
  filters: Record<string, string[]>; // e.g. { category: ["laptops", "fragrances"], brand: ["apple", "samsung"] }
  onFilterChange: (filterType: string, selected: string[]) => void;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: { min: number; max: number };
  onPriceChange?: (min: number, max: number) => void;
};

const FilterSection = ({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: string[];
  selected: string[];
  onChange: (title: string, value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.filterGroup}>
      <div className={styles.filterHeader} onClick={() => setOpen((p) => !p)}>
        <span>{title}</span>
        <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className={styles.filterBody}>
          <div
            className={styles.clearAll}
            onClick={() => onChange(title, "CLEAR_ALL")}
          >
            ✖ Clear all
          </div>
          {options.map((opt) => (
            <label key={opt} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onChange(title, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ filters, onFilterChange, minPrice = 0, maxPrice = 0, priceRange, onPriceChange }: SidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [min, setMin] = useState<number>(priceRange?.min ?? minPrice ?? 0);
  const [max, setMax] = useState<number>(priceRange?.max ?? maxPrice ?? 0);

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

  return (
    <aside className={styles.sidebar}>
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
