import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle, Truck, ArrowLeft } from 'lucide-react';

interface FoodOrder {
  id: string;
  item: string;
  quantity: number;
  orderTime: string;
  estimatedTime: string;
  status: 'ORDERED' | 'PREPARING' | 'DONE' | 'READY_TO_DELIVER' | 'DELIVERED';
  location: string;
}

interface FoodTrackingProps {
  onBack: () => void;
}

const FoodTracking: React.FC<FoodTrackingProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/orders');

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ORDERED':
        return {
          icon: Clock,
          text: 'Order Received',
          color: 'text-[#FF7F6B]',
          bgColor: 'bg-[#FF7F6B]/10',
          borderColor: 'border-[#FF7F6B]/20'
        };
      case 'PREPARING':
        return {
          icon: ChefHat,
          text: 'Preparing',
          color: 'text-[#1CA1A6]',
          bgColor: 'bg-[#1CA1A6]/10',
          borderColor: 'border-[#1CA1A6]/20'
        };
      case 'DONE':
        return {
          icon: CheckCircle,
          text: 'Ready',
          color: 'text-[#1CA1A6]',
          bgColor: 'bg-[#1CA1A6]/10',
          borderColor: 'border-[#1CA1A6]/20'
        };
      case 'READY_TO_DELIVER':
        return {
          icon: Truck,
          text: 'Out for Delivery',
          color: 'text-[#FF7F6B]',
          bgColor: 'bg-[#FF7F6B]/10',
          borderColor: 'border-[#FF7F6B]/20'
        };
      case 'DELIVERED':
        return {
          icon: CheckCircle,
          text: 'Delivered',
          color: 'text-[#0B2545]',
          bgColor: 'bg-[#0B2545]/10',
          borderColor: 'border-[#0B2545]/20'
        };
      default:
        return {
          icon: Clock,
          text: 'Unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getProgressSteps = (currentStatus: string) => {
    const steps = ['ORDERED', 'PREPARING', 'DONE', 'READY_TO_DELIVER', 'DELIVERED'];
    const currentIndex = steps.indexOf(currentStatus);

    return steps.map((step, index) => ({
      step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5E9DA] via-[#F5E9DA] to-[#1CA1A6]/10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1CA1A6] mx-auto"></div>
            <p className="mt-4 text-[#0B2545]">Loading orders...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5E9DA] via-[#F5E9DA] to-[#1CA1A6]/10 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                  onClick={fetchOrders}
                  className="bg-[#1CA1A6] text-white px-6 py-2 rounded-lg hover:bg-[#1CA1A6]/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E9DA] via-[#F5E9DA] to-[#1CA1A6]/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1CA1A6] to-[#1CA1A6]/90 text-white py-6">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-4">
              <button
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Food Order Tracking</h1>
                <p className="text-[#F5E9DA]">Track your delicious orders in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const progressSteps = getProgressSteps(order.status);

              return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="p-6 border-b border-[#F5E9DA]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#0B2545] mb-1">{order.item}</h3>
                          <p className="text-[#0B2545]/70">Order #{order.id} • Qty: {order.quantity}</p>
                          <p className="text-sm text-[#0B2545]/60 mt-1">{order.location}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor} flex items-center gap-2`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                          <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                        </div>
                      </div>

                      <div className="flex gap-6 text-sm text-[#0B2545]/70">
                        <div>
                          <span className="font-medium">Ordered:</span> {order.orderTime}
                        </div>
                        <div>
                          <span className="font-medium">Est. Ready:</span> {order.estimatedTime}
                        </div>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="p-6">
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#F5E9DA]">
                          <div
                              className="h-full bg-[#1CA1A6] transition-all duration-500"
                              style={{
                                width: `${(progressSteps.filter(s => s.completed).length - 1) / (progressSteps.length - 1) * 100}%`
                              }}
                          />
                        </div>

                        {progressSteps.map((step, index) => {
                          const stepInfo = getStatusInfo(step.step);
                          const StepIcon = stepInfo.icon;

                          return (
                              <div key={step.step} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                    step.completed
                                        ? 'bg-[#1CA1A6] border-[#1CA1A6] text-white'
                                        : 'bg-white border-[#F5E9DA] text-[#0B2545]/40'
                                } ${step.active ? 'ring-4 ring-[#1CA1A6]/20 scale-110' : ''}`}>
                                  <StepIcon className="w-4 h-4" />
                                </div>
                                <div className="mt-2 text-center">
                                  <p className={`text-xs font-medium ${
                                      step.completed ? 'text-[#0B2545]' : 'text-[#0B2545]/40'
                                  }`}>
                                    {stepInfo.text}
                                  </p>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Estimated Time */}
                    {order.status !== 'DELIVERED' && (
                        <div className="px-6 pb-6">
                          <div className="bg-[#F5E9DA]/50 rounded-lg p-4 text-center">
                            <p className="text-[#0B2545] font-medium">
                              {order.status === 'READY_TO_DELIVER'
                                  ? 'Your order is on the way to your room!'
                                  : `Estimated completion: ${order.estimatedTime}`
                              }
                            </p>
                          </div>
                        </div>
                    )}
                  </div>
              );
            })}
          </div>

          {/* Refresh Button */}
          <div className="mt-6 text-center">
            <button
                onClick={fetchOrders}
                className="bg-[#1CA1A6] text-white px-6 py-3 rounded-lg hover:bg-[#1CA1A6]/90 transition-colors font-medium"
            >
              Refresh Orders
            </button>
          </div>
        </div>
      </div>
  );
};

export default FoodTracking;