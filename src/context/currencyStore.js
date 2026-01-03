import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CURRENCIES = {
    USD: {
        code: 'USD',
        symbol: '$',
        label: 'US Dollar',
        locale: 'en-US'
    },
    NPR: {
        code: 'NPR',
        symbol: 'रू',
        label: 'Nepalese Rupee',
        locale: 'en-NP'
    }
};

const useCurrencyStore = create(
    persist(
        (set, get) => ({
            currency: 'USD',
            setCurrency: (code) => set({ currency: code }),

            getCurrencyInfo: () => CURRENCIES[get().currency],

            formatAmount: (amount) => {
                const { currency } = get();
                const info = CURRENCIES[currency];

                return new Intl.NumberFormat(info.locale, {
                    style: 'currency',
                    currency: info.code,
                    minimumFractionDigits: 2
                }).format(amount);
            },

            formatSimple: (amount) => {
                const { currency } = get();
                const info = CURRENCIES[currency];
                return `${info.symbol}${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            }
        }),
        {
            name: 'currency-storage'
        }
    )
);

export default useCurrencyStore;
export { CURRENCIES };
