import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CurrencySelect = ({ selectedCurrency, handleCurrency, alignment = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currencyData, setCurrencyData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('https://restcountries.com/v3.1/all?fields=currencies,name,cca2');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const countries = await response.json();

                const processedCurrencies = [];
                const addedCurrencyCodes = new Set(); 

                countries.forEach(country => {
                    if (country.currencies) {
                        for (const currencyCode in country.currencies) {
                            if (!addedCurrencyCodes.has(currencyCode)) {
                                const currencyDetails = country.currencies[currencyCode];
                                processedCurrencies.push({
                                    code: currencyCode,
                                    name: currencyDetails.name || 'Unknown Currency',
                                    countryCode: country.cca2.toLowerCase() 
                                });
                                addedCurrencyCodes.add(currencyCode);
                            }
                        }
                    }
                });

                processedCurrencies.sort((a, b) => a.code.localeCompare(b.code));
                setCurrencyData(processedCurrencies);

            } catch (err) {
                console.error("Failed to fetch currencies:", err);
                setError("Failed to load currencies. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrencies();
    }, []);

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

    const currentCurrency = currencyData.find(c => c.code === selectedCurrency);

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
                {isLoading && <span>Loading Currencies...</span>}
                {error && <span className="text-red-400">{error}</span>}
                {!isLoading && !error && currentCurrency ? (
                    <span className="flex items-center gap-2 text-md md:text-xl font-medium">
                        <img
                            src={getFlagUrl(currentCurrency.countryCode)}
                            alt={`${currentCurrency.name} flag`}
                            className="w-5 h-auto rounded-sm"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/20x15/888/fff?text=?' }} />
                        {currentCurrency.code}
                    </span>
                ) : !isLoading && !error && (
                    <span>Select Currency</span>
                )}
            </motion.button>

            {/* Custom Dropdown List */}
            <AnimatePresence>
                {isOpen && !isLoading && !error && (
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
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/20x15/888/fff?text=?' }}
                                />
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