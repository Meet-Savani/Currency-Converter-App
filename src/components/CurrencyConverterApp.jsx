import React from 'react'
import ConverterForm from './ConverterForm'

const CurrencyConverterApp = () => {
    return (
        <div className=" h-[100vh] bg-gray-900 flex items-center justify-center py-2 px-4  lg:px-8">
            <div className="max-w-2xl w-full space-y-4 bg-gray-800 p-2 md:p-3 rounded-2xl shadow-2xl border border-gray-200/50">
                <h2 className="pb-2 text-center text-xl sm:text-2xl md:text-3xl font-medium text-white border-b-2 border-gray-400 rounded-lg">
                    Currency Converter
                </h2>
                <ConverterForm />
            </div>
        </div>
    )
}

export default CurrencyConverterApp
