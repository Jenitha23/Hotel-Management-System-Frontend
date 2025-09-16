import React, { useState } from 'react';
import { Hotel, Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsEmailSent(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-green-50">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl mb-6 shadow-lg border border-gray-100">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h1>
            <p className="text-gray-600">We've sent password reset instructions</p>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Sent Successfully!</h2>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to:
              </p>
              <p className="text-teal-600 font-medium break-all">{email}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                Please check your inbox and click the reset link to create a new password. 
                The link will expire in 24 hours for security reasons.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium border border-gray-200 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                ) : (
                  <>
                    Resend Email
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>

              <button
                onClick={onNavigateToLogin}
                className="w-full bg-gradient-to-r from-teal-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-teal-600 hover:to-green-700 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400">
                Didn't receive the email? Check your spam folder or contact support if you continue to have issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-green-50">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl mb-6 shadow-lg border border-gray-100">
            <img src="/logo.jpg" alt="Palm Beach Resort Ceylon" className="w-20 h-20 object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {error && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• We'll send a secure reset link to your email</li>
                <li>• Click the link to create a new password</li>
                <li>• The link expires in 24 hours for security</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-teal-600 hover:to-green-700 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={onNavigateToLogin}
              className="text-teal-600 hover:text-teal-500 font-medium transition-colors duration-200 flex items-center justify-center w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            For your security, password reset links are only valid for 24 hours. 
            If you don't receive an email, please check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;