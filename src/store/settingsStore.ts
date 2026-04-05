/* eslint-disable */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = {
    code: string;
    symbol: string;
    rate: number; // rate relative to USD
};

interface SettingsState {
    storeName: string;
    currency: Currency;
    availableCurrencies: Currency[];
    payhereEnabled: boolean;
    bankEnabled: boolean;
    codEnabled: boolean;
    bankName: string;
    bankAccount: string;
    bankBranch: string;
    codTerms: string;
    deliveryTerms: string;
    setCurrency: (code: string) => void;
    updateRate: (code: string, newRate: number) => void;
    syncSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            storeName: 'VibeZ',
            currency: { code: 'LKR', symbol: 'Rs.', rate: 1 },
            availableCurrencies: [
                { code: 'LKR', symbol: 'Rs.', rate: 1 },
                { code: 'USD', symbol: '$', rate: 0.0033 },
                { code: 'EUR', symbol: '€', rate: 0.92 },
                { code: 'GBP', symbol: '£', rate: 0.79 },
            ],
            payhereEnabled: true,
            bankEnabled: true,
            codEnabled: true,
            bankName: '',
            bankAccount: '',
            bankBranch: '',
            codTerms: '',
            deliveryTerms: '',
            setCurrency: (code) => set((state) => {
                const newCurrency = state.availableCurrencies.find(c => c.code === code);
                return newCurrency ? { currency: newCurrency } : state;
            }),
            updateRate: (code, newRate) => set((state) => ({
                availableCurrencies: state.availableCurrencies.map(c =>
                    c.code === code ? { ...c, rate: newRate } : c
                ),
                currency: state.currency.code === code
                    ? { ...state.currency, rate: newRate }
                    : state.currency
            })),
            syncSettings: async () => {
                try {
                    const res = await fetch('/api/settings');
                    const data = await res.json();
                    if (data && !data.error) {
                        set({
                            storeName: data.storeName,
                            currency: {
                                code: data.currencyCode,
                                symbol: data.currencySymbol,
                                rate: 1 
                            },
                            payhereEnabled: data.payhereEnabled,
                            bankEnabled: data.bankEnabled,
                            codEnabled: data.codEnabled,
                            bankName: data.bankName || '',
                            bankAccount: data.bankAccount || '',
                            bankBranch: data.bankBranch || '',
                            codTerms: data.codTerms || '',
                            deliveryTerms: data.deliveryTerms || '',
                        });
                    }
                } catch (error) {
                    console.error("Failed to sync settings:", error);
                }
            }
        }),
        {
            name: 'settings-storage',
        }
    )
);
