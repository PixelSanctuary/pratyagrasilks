'use client';

import { useState } from 'react';

interface FilterSidebarProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    category: string;
    minPrice: number;
    maxPrice: number;
    search: string;
}

const categories = [
    { value: '', label: 'All Categories' },
    { value: 'sarees', label: 'Sarees' },
    { value: 'dress-materials', label: 'Dress Materials' },
    { value: 'dupattas', label: 'Dupattas' },
    { value: 'stoles', label: 'Stoles' },
    { value: 'fabric', label: 'Fabric' },
];

const priceRanges = [
    { min: 0, max: 0, label: 'All Prices' },
    { min: 0, max: 5000, label: 'Under ₹5,000' },
    { min: 5000, max: 10000, label: '₹5,000 - ₹10,000' },
    { min: 10000, max: 20000, label: '₹10,000 - ₹20,000' },
    { min: 20000, max: 50000, label: '₹20,000 - ₹50,000' },
    { min: 50000, max: 0, label: 'Above ₹50,000' },
];

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
    const [filters, setFilters] = useState<FilterState>({
        category: '',
        minPrice: 0,
        maxPrice: 0,
        search: '',
    });

    const handleCategoryChange = (category: string) => {
        const newFilters = { ...filters, category };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceRangeChange = (min: number, max: number) => {
        const newFilters = { ...filters, minPrice: min, maxPrice: max };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSearchChange = (search: string) => {
        const newFilters = { ...filters, search };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const newFilters = {
            category: '',
            minPrice: 0,
            maxPrice: 0,
            search: '',
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                </label>
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <label key={cat.value} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={cat.value}
                                checked={filters.category === cat.value}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-amber-700">
                                {cat.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                        <label key={index} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="priceRange"
                                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                                onChange={() => handlePriceRangeChange(range.min, range.max)}
                                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-amber-700">
                                {range.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.category || filters.minPrice > 0 || filters.maxPrice > 0 || filters.search) && (
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h3>
                    <div className="space-y-1">
                        {filters.category && (
                            <div className="text-xs text-gray-600">
                                Category: <span className="font-medium">{filters.category}</span>
                            </div>
                        )}
                        {(filters.minPrice > 0 || filters.maxPrice > 0) && (
                            <div className="text-xs text-gray-600">
                                Price: <span className="font-medium">
                                    {filters.minPrice > 0 ? `₹${filters.minPrice.toLocaleString()}` : '₹0'} -
                                    {filters.maxPrice > 0 ? ` ₹${filters.maxPrice.toLocaleString()}` : ' ∞'}
                                </span>
                            </div>
                        )}
                        {filters.search && (
                            <div className="text-xs text-gray-600">
                                Search: <span className="font-medium">{filters.search}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
