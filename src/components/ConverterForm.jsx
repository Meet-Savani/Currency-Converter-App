import React, { useState, useEffect, useCallback } from 'react'
import { IoMdSwap } from "react-icons/io";
import CurrencySelect from './CurrencySelect';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const ConverterForm = () => {

    // Initialize currency states from localStorage or use defaults 
    const [fromCurrency, setFromCurrency] = useState(() => {
        const storedFrom = localStorage.getItem('fromCurrency');
        return storedFrom ? storedFrom : "USD";
    });
    const [toCurrency, setToCurrency] = useState(() => {
        const storedTo = localStorage.getItem('toCurrency');
        return storedTo ? storedTo : "INR";
    });

    const[amount, setAmount] = useState(1);
    const[result, setResult] = useState("");
    const[isLoading, setIsLoading] = useState(true);
    const [rotated, setRotated] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const[error, setError] = useState(null);

    const rotateIcon = () => {
        setRotated(prev => !prev);  
        handleSwapCurrency();
    }

    const handleSwapCurrency = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    const getExchangeRateOfCurrencies = useCallback(async () => {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

        setIsLoading(true);
        setError(null);

        if (amount <= 0) {
            setResult("");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL);
            // Check for specific HTTP status codes like 429 Too Many Requests
            if (response.status === 429) {
                throw new Error("Rate limit exceeded. Please wait a moment and try again.");
            }

            if(!response.ok) {
                throw new Error("Failed to fetch exchange rates. Please check your connection or try again later.");
            }

            const data = await response.json()
            if (data.result === "error") {
                let errorMessage = "An unknown API error occurred.";
                switch (data["error-type"]) {
                    case "invalid-key":
                        errorMessage = "Invalid API key. Please check your API configuration.";
                        break;
                    case "malformed-request":
                        errorMessage = "Invalid currency pair or request format.";
                        break;
                    case "unsupported-code":
                        errorMessage = "Unsupported currency code provided.";
                        break;
                    case "inactive-account":
                        errorMessage = "API account is inactive. Please check your API status.";
                        break;
                    case "quota-reached": 
                        errorMessage = "API quota reached. Please try again after some time.";
                        break;
                    default:
                        errorMessage = `API Error: ${data["error-type"] || "Unknown error type"}.`;
                }
                throw new Error(errorMessage);
            }

            const rate = (data.conversion_rate * amount).toFixed(2);
            setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
        } catch (error) {
            console.log("Conversion error:", error);
            setError(error.message || "An unexpected error occurred."); 
            setResult("");
        }
        finally {
            setIsLoading(false);
        }
    }, [amount, fromCurrency, toCurrency]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (amount <= 0) {
            setError("Please enter a positive amount.");
            setResult("");
            return;
        }
        getExchangeRateOfCurrencies();
    }

    useEffect(() => {
        getExchangeRateOfCurrencies();
    }, []); 
    
    // Effect to save fromCurrency to localStorage
    useEffect(() => {
        localStorage.setItem('fromCurrency', fromCurrency);
    }, [fromCurrency]);

    // Effect to save toCurrency to localStorage
    useEffect(() => {
        localStorage.setItem('toCurrency', toCurrency);
    }, [toCurrency]);

    return (
        <form className='converter-form flex flex-col' onSubmit={handleFormSubmit}>
            <div className='form-group flex flex-col gap-2'>
                <label className='form-label text-xl font-medium text-gray-100' htmlFor='amount'>
                    Enter Amount</label>
                    <motion.div
                    animate={{
                    scale: isFocused ? 1.01 : 1,
                    boxShadow: isFocused
                        ? "0 0 10px rgba(96, 165, 250, 0.5)" 
                        : "none",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-xl">
                        <input
                        type="number"
                        name='amount'
                        id='amount'
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value)
                            setError(null);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="form-input rounded-xl px-2 py-1 md:px-4 md:py-2.5 w-full bg-[#1e293b] border outline-none border-gray-400 text-white placeholder:text-gray-300"
                        required/>
                    </motion.div>
                    {error && amount <= 0 && <p className="text-red-400 text-sm mt-1 text-center">{error}</p>}
            </div>

            <div className='form-group flex items-center gap-4 sm:gap-6 justify-center mt-2 md:mt-4'>
                <div className='form-selection flex flex-col gap-2'>
                    <label className='form-label text-lg md:text-xl font-medium text-gray-100 ml-1' htmlFor='fromAmount'>From</label>
                    <CurrencySelect 
                    id='fromAmount'
                    alignment='left'
                    selectedCurrency={fromCurrency} 
                    handleCurrency={(e) => {
                        setFromCurrency(e.target.value)
                        setError(null);
                    }} />
                </div>

                <motion.div 
                animate={{ rotate: rotated ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, duration:0.4 }}
                onClick={rotateIcon}
                className="swap-icon flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#4b5563] mt-8 shadow-md cursor-pointer">
                    <IoMdSwap className='text-2xl sm:text-3xl cursor-pointer text-white' />
                </motion.div>

                <div className='form-group flex items-center justify-center'>
                    <div className='form-selection flex flex-col gap-2'>
                        <label className='form-label text-lg md:text-xl font-medium text-gray-100 ml-1' htmlFor='toAmount'>To</label>
                        <CurrencySelect
                        id='toAmount'
                        alignment='right'
                        selectedCurrency={toCurrency}
                        handleCurrency={(e) => {
                            setToCurrency(e.target.value)
                            setError(null);
                        }}  />
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-center mb-2'>
                <motion.button 
                    initial={{ y: -15, opacity: 0, backgroundPosition: "0% 50%" }}
                    animate={{ y: 0, opacity: 1, backgroundPosition: "100% 50%" }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: `
                            0 0 2px rgba(59, 130, 246, 0.6), 
                            0 0 5px rgba(147, 197, 253, 0.4), 
                            0 0 7px rgba(59, 130, 246, 0.8)`,
                        backgroundPosition: "200% 50%",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 280, damping: 25, duration: 0.5 }}
                    type='submit' 
                    className={`submit-btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-1.5 md:px-4 md:py-3 text-xl font-bold rounded-lg mt-4 md:mt-6 w-full mx-2 shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Converting...
                        </div>
                    ) : (
                        "Get Exchange Rate"
                    )}
                </motion.button>
            </div>

            {/* Display API/general errors here */}
            {
                error && amount > 0 && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            }
            {/* If result value exist then display */}
            { 
                result && <p className="exchange-rate-result text-white mt-2 md:mt-4 bg-gradient-to-r from-green-400 to-green-600 text-xl text-center px-2 py-3 md:px-2 md:py-5 rounded-lg mx-2 shadow-lg" aria-live='polite'>
                    { isLoading ? "Getting Exchange Rate..." : result }
                </p>
            }
        </form>
    )
}

export default ConverterForm