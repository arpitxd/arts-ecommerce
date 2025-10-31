"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@src/context/CartContext";
import { useSearch } from "@src/context/SearchContext";
import styles from "./style.module.scss";

export default function Header() {
  const { cartCount } = useCart();
  const { setQuery } = useSearch();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setQuery(text.trim()); // ✅ update global search query
    setLoading(false);
    setShowSuggest(false);
  };

  // Debounced suggestions fetch
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      setShowSuggest(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(text.trim())}`);
        const data = await res.json();
        const items = (data?.products ?? []).slice(0, 8);
        setSuggestions(items);
        setShowSuggest(items.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        // swallow errors for UX; optionally log
        setSuggestions([]);
        setShowSuggest(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!formRef.current) return;
      if (!formRef.current.contains(ev.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggest || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const sel = suggestions[activeIndex];
        setText(sel.title);
        setQuery(sel.title);
        setShowSuggest(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggest(false);
    }
  };

  const onSelectSuggestion = (item: any) => {
    setText(item.title);
    setQuery(item.title);
    setShowSuggest(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Arts<span className={styles.highlight}>Store</span>
        </Link>

        <form ref={formRef} onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search for products..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            className={styles.searchInput}
          />
          <button type="submit" disabled={loading} className={styles.searchButton}>
            {loading ? "..." : "🔍"}
          </button>

          {showSuggest && suggestions.length > 0 && (
            <div className={styles.suggestBox}>
              <ul className={styles.suggestList}>
                {suggestions.map((item, idx) => (
                  <li
                    key={item.id}
                    className={`${styles.suggestItem} ${idx === activeIndex ? styles.activeItem : ""}`}
                    onMouseDown={(e) => {
                      // prevent input blur before click
                      e.preventDefault();
                      onSelectSuggestion(item);
                    }}
                  >
                    {/* simple text; can add thumbnail if desired */}
                    <span className={styles.title}>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <Link href="/cart" className={styles.cart}>
          🛒
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
}
