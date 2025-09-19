import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement signup logic
        console.log('Signup attempt with:', formData);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800 opacity-40"></div>

                {/* Restaurant Image */}
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')]
          bg-cover bg-center opacity-90"
                ></div>

                {/* Animated Shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-[100%] animate-[spin_30s_linear_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    <div className="absolute -inset-[100%] animate-[spin_25s_linear_infinite] bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
            </div>

            {/* Sign Up Form */}
            <div className="relative max-w-md w-full mx-4">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-red-500/20">
                    <div className="p-8 space-y-8">
                        {/* Title Section */}
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
                            <p className="text-gray-600">Join our restaurant community</p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter first name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter last name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        {/* Sign In Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;