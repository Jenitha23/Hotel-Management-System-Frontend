import React, { useState } from 'react';
import { Hotel, User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, LogOut, Shield, Bell, CreditCard } from 'lucide-react';

interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  memberSince: string;
}

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateProfile(editedUser);
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen p-4 py-8 bg-gradient-to-br from-teal-50 to-green-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mr-4 shadow-lg border border-gray-100">
              <img src="/logo.jpg" alt="Palm Beach Resort Ceylon" className="w-12 h-12 object-contain rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Profile Dashboard</h1>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors duration-200 border border-teal-200"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-green-600/20 border-t-green-600 rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100">
                    <User className="w-10 h-10 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">Resort Guest</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-400">Member since {user.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="name"
                        type="text"
                        value={isEditing ? editedUser.name : user.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 ${
                          isEditing ? 'focus:ring-2 focus:ring-teal-400 focus:border-transparent' : 'cursor-default'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        value={isEditing ? editedUser.email : user.email}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 ${
                          isEditing ? 'focus:ring-2 focus:ring-teal-400 focus:border-transparent' : 'cursor-default'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="phone"
                        type="tel"
                        value={isEditing ? editedUser.phone : user.phone}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 ${
                          isEditing ? 'focus:ring-2 focus:ring-teal-400 focus:border-transparent' : 'cursor-default'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="address"
                        type="text"
                        value={isEditing ? editedUser.address : user.address}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 ${
                          isEditing ? 'focus:ring-2 focus:ring-teal-400 focus:border-transparent' : 'cursor-default'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <span className="px-2 py-1 bg-teal-500/20 text-teal-600 text-sm rounded-full">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">Premium</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-gray-700">
                  <Shield className="w-5 h-5 mr-3 text-teal-600" />
                  Security Settings
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-gray-700">
                  <Bell className="w-5 h-5 mr-3 text-teal-600" />
                  Notifications
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-gray-700">
                  <CreditCard className="w-5 h-5 mr-3 text-teal-600" />
                  Payment Methods
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-800">Profile updated</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-800">Login successful</p>
                  <p className="text-gray-400 text-xs">1 day ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-800">Password changed</p>
                  <p className="text-gray-400 text-xs">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;