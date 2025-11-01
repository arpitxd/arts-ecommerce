import React, {useState} from "react";
import styles from "./style.module.scss";

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

export default FilterSection;