import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AdminNav from '../components/ui/AdminNav';
import { useAuth } from '../../hooks';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Spinner from '../components/ui/Spinner';
import axiosInstance from '../utils/axios';

const FinancialPage = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [places, setPlaces] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [budgetForm, setBudgetForm] = useState({
        propertyId: '',
        category: 'maintenance',
        amount: '',
        period: 'monthly',
        description: '',
        startDate: ''
    });

    // Mock financial data for demonstration
    const mockFinancialData = {
        overview: {
            totalRevenue: 45000,
            totalExpenses: 12500,
            netProfit: 32500,
            occupancyRate: 85,
            averageNightlyRate: 1200
        },
        revenueData: [
            { property: 'Downtown Apartment', monthly: 15000, yearly: 180000, occupancy: 90 },
            { property: 'Beach House Villa', monthly: 20000, yearly: 240000, occupancy: 85 },
            { property: 'City Center Loft', monthly: 10000, yearly: 120000, occupancy: 80 }
        ],
        expenseCategories: [
            { category: 'Maintenance', amount: 4500, percentage: 36, budget: 5000 },
            { category: 'Utilities', amount: 3000, percentage: 24, budget: 3200 },
            { category: 'Cleaning', amount: 2500, percentage: 20, budget: 2800 },
            { category: 'Insurance', amount: 1500, percentage: 12, budget: 1500 },
            { category: 'Marketing', amount: 1000, percentage: 8, budget: 1200 }
        ],
        monthlyTrends: [
            { month: 'Jan', revenue: 42000, expenses: 11000 },
            { month: 'Feb', revenue: 38000, expenses: 10500 },
            { month: 'Mar', revenue: 45000, expenses: 12000 },
            { month: 'Apr', revenue: 48000, expenses: 13500 },
            { month: 'May', revenue: 52000, expenses: 14000 },
            { month: 'Jun', revenue: 55000, expenses: 12500 }
        ],
        budgets: [
            { id: 1, property: 'Downtown Apartment', category: 'Maintenance', amount: 2000, period: 'monthly', spent: 1800 },
            { id: 2, property: 'Beach House Villa', category: 'Utilities', amount: 1500, period: 'monthly', spent: 1450 },
            { id: 3, property: 'City Center Loft', category: 'Cleaning', amount: 1000, period: 'monthly', spent: 950 }
        ]
    };

    useEffect(() => {
        // Check if user is admin using the auth context
        if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
            return;
        }

        fetchPlaces();
    }, [auth.user]);

    const fetchPlaces = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/places/admin/list');
            console.log('Admin places response:', data);

            // Handle the response format consistently
            if (data.success && Array.isArray(data.places)) {
                setPlaces(data.places);
            } else if (Array.isArray(data)) {
                setPlaces(data);
            } else {
                setPlaces([]);
            }
        } catch (error) {
            console.log('Error fetching places:', error);
            // Fallback to public places if admin endpoint fails
            try {
                const { data } = await axiosInstance.get('/places');
                setPlaces(Array.isArray(data.places) ? data.places : []);
            } catch (fallbackError) {
                console.log('Fallback error:', fallbackError);
                setPlaces([]); // Ensure places is always an array
                toast.error('Failed to load properties');
            }
        } finally {
            setLoading(false);
        }
    };

    // Check authentication using the auth context
    if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
        return <Navigate to="/admin/login" />;
    }

    const handleBudgetFormChange = (e) => {
        const { name, value } = e.target;
        setBudgetForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitBudget = async (e) => {
        e.preventDefault();

        if (!budgetForm.propertyId || !budgetForm.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('Budget created successfully!');
            setBudgetForm({
                propertyId: '',
                category: 'maintenance',
                amount: '',
                period: 'monthly',
                description: '',
                startDate: ''
            });
        } catch (error) {
            toast.error('Failed to create budget. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'maintenance':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'utilities':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'cleaning':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                );
            case 'insurance':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'marketing':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                );
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading && places.length === 0) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Use AdminNav component */}
            <AdminNav />

            <div className="mx-auto max-w-6xl p-4 pt-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Financial & Budgeting Management
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Track revenue, manage expenses, and plan budgets for your properties
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Financial Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('revenue')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'revenue'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Revenue Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('expenses')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'expenses'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Expense Tracking
                        </button>
                        <button
                            onClick={() => setActiveTab('budgets')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'budgets'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Budget Planning
                        </button>
                    </nav>
                </div>

                {/* Financial Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatCurrency(mockFinancialData.overview.totalRevenue)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatCurrency(mockFinancialData.overview.totalExpenses)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Net Profit</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatCurrency(mockFinancialData.overview.netProfit)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Occupancy Rate</dt>
                                            <dd className="text-lg font-medium text-gray-900">{mockFinancialData.overview.occupancyRate}%</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Avg. Nightly Rate</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatCurrency(mockFinancialData.overview.averageNightlyRate)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Trends Chart */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue vs Expenses</h3>
                            <div className="space-y-4">
                                {mockFinancialData.monthlyTrends.map((month, index) => (
                                    <div key={month.month} className="flex items-center space-x-4">
                                        <div className="w-12 text-sm font-medium text-gray-500">{month.month}</div>
                                        <div className="flex-1">
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm text-green-600">Revenue</span>
                                                        <span className="text-sm font-medium">{formatCurrency(month.revenue)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${(month.revenue / 60000) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm text-red-600">Expenses</span>
                                                        <span className="text-sm font-medium">{formatCurrency(month.expenses)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-red-500 h-2 rounded-full"
                                                            style={{ width: `${(month.expenses / 15000) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Revenue Analysis Tab */}
                {activeTab === 'revenue' && (
                    <div className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Revenue by Property</h3>
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="month">Monthly</option>
                                    <option value="year">Yearly</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                {mockFinancialData.revenueData.map((property, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-900">{property.property}</h4>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-500">Occupancy: {property.occupancy}%</span>
                                                <span className="text-lg font-semibold">
                                                    {formatCurrency(selectedPeriod === 'month' ? property.monthly : property.yearly)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-primary h-3 rounded-full"
                                                style={{ width: `${property.occupancy}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Expense Tracking Tab */}
                {activeTab === 'expenses' && (
                    <div className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Expense Categories</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {mockFinancialData.expenseCategories.map((expense, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-primary">
                                                {getCategoryIcon(expense.category)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{expense.category}</h4>
                                                <p className="text-sm text-gray-500">{expense.percentage}% of total</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Spent: {formatCurrency(expense.amount)}</span>
                                                <span>Budget: {formatCurrency(expense.budget)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${expense.amount > expense.budget ? 'bg-red-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${Math.min((expense.amount / expense.budget) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Budget Planning Tab */}
                {activeTab === 'budgets' && (
                    <div className="space-y-6">
                        {/* Create New Budget Form */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Budget</h3>
                            <form onSubmit={handleSubmitBudget} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="propertyId">Property *</Label>
                                        <select
                                            id="propertyId"
                                            name="propertyId"
                                            value={budgetForm.propertyId}
                                            onChange={handleBudgetFormChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            required
                                        >
                                            <option value="">Select a property</option>
                                            {Array.isArray(places) && places.map((place) => (
                                                <option key={place._id} value={place._id}>
                                                    {place.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={budgetForm.category}
                                            onChange={handleBudgetFormChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            required
                                        >
                                            <option value="maintenance">Maintenance</option>
                                            <option value="utilities">Utilities</option>
                                            <option value="cleaning">Cleaning</option>
                                            <option value="insurance">Insurance</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="furnishing">Furnishing</option>
                                            <option value="supplies">Supplies</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="amount">Budget Amount *</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            value={budgetForm.amount}
                                            onChange={handleBudgetFormChange}
                                            placeholder="Enter amount"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="period">Period *</Label>
                                        <select
                                            id="period"
                                            name="period"
                                            value={budgetForm.period}
                                            onChange={handleBudgetFormChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            required
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                            value={budgetForm.startDate}
                                            onChange={handleBudgetFormChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={budgetForm.description}
                                        onChange={handleBudgetFormChange}
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Optional budget description or notes..."
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto"
                                    >
                                        {loading ? 'Creating...' : 'Create Budget'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Existing Budgets */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Current Budgets</h3>
                            <div className="space-y-4">
                                {mockFinancialData.budgets.map((budget) => (
                                    <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="text-primary">
                                                    {getCategoryIcon(budget.category)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{budget.property}</h4>
                                                    <p className="text-sm text-gray-500">{budget.category} - {budget.period}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-semibold">{formatCurrency(budget.amount)}</div>
                                                <div className="text-sm text-gray-500">
                                                    Spent: {formatCurrency(budget.spent)} ({Math.round((budget.spent / budget.amount) * 100)}%)
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${budget.spent > budget.amount ? 'bg-red-500' :
                                                    (budget.spent / budget.amount) > 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancialPage;
