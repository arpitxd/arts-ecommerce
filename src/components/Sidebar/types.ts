export type SidebarProps = {
    filters: Record<string, string[]>; // e.g. { category: ["laptops", "fragrances"], brand: ["apple", "samsung"] }
    onFilterChange: (filterType: string, selected: string[]) => void;
    minPrice?: number;
    maxPrice?: number;
    priceRange?: { min: number; max: number };
    onPriceChange?: (min: number, max: number) => void;
};
