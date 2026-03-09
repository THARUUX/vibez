"use client";

import { useSettingsStore } from "@/store/settingsStore";

interface PriceProps {
    amount: number | string;
    className?: string;
    showCode?: boolean;
}

export function Price({ amount, className = "", showCode = false }: PriceProps) {
    const { currency } = useSettingsStore();

    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // In a real app with multiple rates, we'd do:
    // const displayAmount = numericAmount * currency.rate;
    // For now, we assume the DB price is in the base currency and we just show the symbol.
    const displayAmount = numericAmount;

    return (
        <span className={`font-outfit ${className}`}>
            <span className="mr-0.5">{currency.symbol}</span>
            {displayAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}
            {showCode && <span className="ml-1 text-[0.7em] opacity-70 uppercase">{currency.code}</span>}
        </span>
    );
}
