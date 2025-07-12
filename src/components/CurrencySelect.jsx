import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const CurrencySelect = ({ selectedCurrency, handleCurrency, alignment = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currencyData = [
        { code: "USD", name: "United States Dollar", countryCode: "us" },
        { code: "EUR", name: "Euro", countryCode: "eu" }, 
        { code: "GBP", name: "British Pound Sterling", countryCode: "gb" },
        { code: "JPY", name: "Japanese Yen", countryCode: "jp" },
        { code: "CAD", name: "Canadian Dollar", countryCode: "ca" },
        { code: "AUD", name: "Australian Dollar", countryCode: "au" },
        { code: "CHF", name: "Swiss Franc", countryCode: "ch" },
        { code: "CNY", name: "Chinese Yuan", countryCode: "cn" },
        { code: "INR", name: "Indian Rupee", countryCode: "in" },
        { code: "BRL", name: "Brazilian Real", countryCode: "br" },
        { code: "ZAR", name: "South African Rand", countryCode: "za" },
        { code: "RUB", name: "Russian Ruble", countryCode: "ru" },
        { code: "MXN", name: "Mexican Peso", countryCode: "mx" },
        { code: "SGD", name: "Singapore Dollar", countryCode: "sg" },
        { code: "HKD", name: "Hong Kong Dollar", countryCode: "hk" },
        { code: "NZD", name: "New Zealand Dollar", countryCode: "nz" },
        { code: "SEK", name: "Swedish Krona", countryCode: "se" },
        { code: "NOK", name: "Norwegian Krone", countryCode: "no" },
        { code: "DKK", name: "Danish Krone", countryCode: "dk" },
        { code: "PLN", name: "Polish Zloty", countryCode: "pl" },
        { code: "KRW", name: "South Korean Won", countryCode: "kr" },
        { code: "THB", name: "Thai Baht", countryCode: "th" },
        { code: "MYR", name: "Malaysian Ringgit", countryCode: "my" },
        { code: "IDR", name: "Indonesian Rupiah", countryCode: "id" },
        { code: "PHP", name: "Philippine Peso", countryCode: "ph" },
        { code: "AED", name: "United Arab Emirates Dirham", countryCode: "ae" },
        { code: "ARS", name: "Argentine Peso", countryCode: "ar" },
        { code: "CLP", name: "Chilean Peso", countryCode: "cl" },
        { code: "COP", name: "Colombian Peso", countryCode: "co" },
        { code: "CZK", name: "Czech Koruna", countryCode: "cz" },
        { code: "EGP", name: "Egyptian Pound", countryCode: "eg" },
        { code: "HUF", name: "Hungarian Forint", countryCode: "hu" },
        { code: "ILS", name: "Israeli New Shekel", countryCode: "il" },
        { code: "KWD", name: "Kuwaiti Dinar", countryCode: "kw" },
        { code: "LBP", name: "Lebanese Pound", countryCode: "lb" },
        { code: "NGN", name: "Nigerian Naira", countryCode: "ng" },
        { code: "PEN", name: "Peruvian Sol", countryCode: "pe" },
        { code: "PKR", name: "Pakistani Rupee", countryCode: "pk" },
        { code: "RON", name: "Romanian Leu", countryCode: "ro" },
        { code: "SAR", name: "Saudi Riyal", countryCode: "sa" },
        { code: "TRY", name: "Turkish Lira", countryCode: "tr" },
        { code: "TWD", name: "New Taiwan Dollar", countryCode: "tw" },
        { code: "UAH", name: "Ukrainian Hryvnia", countryCode: "ua" },
        { code: "VEF", name: "Venezuelan Bolívar", countryCode: "ve" },
        { code: "VND", name: "Vietnamese Dong", countryCode: "vn" },
        { code: "XAF", name: "CFA Franc BEAC", countryCode: "cm" }, 
        { code: "XCD", name: "East Caribbean Dollar", countryCode: "ag" }, 
        { code: "XOF", name: "CFA Franc BCEAO", countryCode: "bj" },
        { code: "XPF", name: "CFP Franc", countryCode: "pf" },
        { code: "YER", name: "Yemeni Rial", countryCode: "ye" }
    ];

    const currentCurrency = currencyData.find(c => c.code === selectedCurrency);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (currencyCode) => {
        handleCurrency({ target: { value: currencyCode } });
        setIsOpen(false);
    };

    const getFlagUrl = (countryCode) => {
        return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`; 
    };

    const alignmentClass = alignment === "right" ? "right-0" : "left-0";

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Custom Select Button */}
            <motion.button
                type="button" 
                onClick={() => setIsOpen(!isOpen)}
                className="currency-select-button flex items-center justify-between rounded-xl px-3 py-1.5 md:px-4 md:py-3 w-full bg-[#1e293b] border outline-none border-gray-400 text-white cursor-pointer focus:ring-2 focus:ring-blue-500"
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, boxShadow: "0 0 8px rgba(96, 165, 250, 0.6)" }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                {currentCurrency ? (
                    <span className="flex items-center gap-2 text-md md:text-xl font-medium">
                        <img
                            src={getFlagUrl(currentCurrency.countryCode)}
                            alt={`${currentCurrency.name} flag`}
                            className="w-5 h-auto rounded-sm"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/20x15/888/fff?text=?' }} />
                        {currentCurrency.code} 
                    </span>
                ) : (
                    <span>Select Currency</span>
                )}
            </motion.button>

            {/* Custom Dropdown List */}
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className={`currency-select-dropdown overflow-x-hidden absolute z-10 w-64 md:w-72 mt-1 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg max-h-40 md:max-h-48 overflow-y-auto ${alignmentClass}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        {currencyData.map((currency) => (
                            <motion.li
                                key={currency.code}
                                className="flex items-center gap-2 px-3 py-2 text-white cursor-pointer hover:bg-gray-700 text-md md:text-lg"
                                onClick={() => handleOptionClick(currency.code)}
                                whileHover={{ scale: 1.02, backgroundColor: "#374151" }} 
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                <img
                                    src={getFlagUrl(currency.countryCode)}
                                    alt={`${currency.name} flag`}
                                    className="w-5 h-auto rounded-sm"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/20x15/888/fff?text=?' }}  />
                                {currency.code} - {currency.name}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CurrencySelect;
