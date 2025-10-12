import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, ChefHat, CheckCircle, Truck, CreditCard as Edit3, Save, X, Plus, Search, Filter } from 'lucide-react';

interface AdminOrder {
  id: string;
  customerName: string;
  roomNumber: string;
  item: string;
  quantity: number;
  orderTime: string;
  estimatedTime: string;
  status: 'ordered' | 'preparing' | 'done' | 'ready-to-deliver' | 'delivered';
  location: string;
  specialInstructions?: string;
  priority: 'normal' | 'high' | 'urgent';
}

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: "ORD-001",
      customerName: "Sarah Johnson",
      roomNumber: "247",
      item: "Sunset Dinner Special",
      quantity: 1,
      orderTime: "6:30 PM",
      estimatedTime: "7:15 PM",
      status: "preparing",
      location: "Beachside Restaurant",
      specialInstructions: "No shellfish",
      priority: "normal"
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      roomNumber: "247",
      item: "Beach Bar & Appetizers",
      quantity: 1,
      orderTime: "5:45 PM",
      estimatedTime: "6:00 PM",
      status: "ready-to-deliver",
      location: "Pool Bar",
      priority: "normal"
    },
    {
      id: "ORD-003",
      customerName: "Mike Chen",
      roomNumber: "156",
      item: "Tropical Breakfast Buffet",
      quantity: 2,
      orderTime: "8:00 AM",
      estimatedTime: "8:30 AM",
      status: "delivered",
      location: "Main Restaurant",
      priority: "normal"
    },
    {
      id: "ORD-004",
      customerName: "Emily Davis",
      roomNumber: "312",
      item: "Poolside Lunch & Cocktails",
      quantity: 1,
      orderTime: "12:30 PM",
      estimatedTime: "1:00 PM",
      status: "done",
      location: "Pool Grill",
      specialInstructions: "Extra spicy",
      priority: "high"
    },
    {
      id: "ORD-005",
      customerName: "Robert Wilson",
      roomNumber: "089",
      item: "Room Service Breakfast",
      quantity: 1,
      orderTime: "7:15 AM",
      estimatedTime: "8:00 AM",
      status: "ordered",
      location: "Room Service",
      priority: "urgent"
    }
  ]);

  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ordered':
        return {
          icon: Clock,
          text: 'Order Received',
          color: 'text-[#FF7F6B]',
          bgColor: 'bg-[#FF7F6B]/10',
          borderColor: 'border-[#FF7F6B]/20'
        };
      case 'preparing':
        return {
          icon: ChefHat,
          text: 'Preparing',
          color: 'text-[#1CA1A6]',
          bgColor: 'bg-[#1CA1A6]/10',
          borderColor: 'border-[#1CA1A6]/20'
        };
      case 'done':
        return {
          icon: CheckCircle,
          text: 'Ready',
          color: 'text-[#1CA1A6]',
          bgColor: 'bg-[#1CA1A6]/10',
          borderColor: 'border-[#1CA1A6]/20'
        };
      case 'ready-to-deliver':
        return {
          icon: Truck,
          text: 'Out for Delivery',
          color: 'text-[#FF7F6B]',
          bgColor: 'bg-[#FF7F6B]/10',
          borderColor: 'border-[#FF7F6B]/20'
        };
      case 'delivered':
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateOrderTime = (orderId: string, newTime: string) => {
    setOrders(orders.map(order =>
        order.id === orderId ? { ...order, estimatedTime: newTime } : order
    ));
  };

  const updateOrderField = (orderId: string, field: keyof AdminOrder, value: any) => {
    setOrders(orders.map(order =>
        order.id === orderId ? { ...order, [field]: value } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.roomNumber.includes(searchTerm) ||
        order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const orderStats = {
    total: orders.length,
    ordered: orders.filter(o => o.status === 'ordered').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    done: orders.filter(o => o.status === 'done').length,
    delivering: orders.filter(o => o.status === 'ready-to-deliver').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    urgent: orders.filter(o => o.priority === 'urgent').length
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E9DA] via-[#F5E9DA] to-[#1CA1A6]/10 p-6">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-6">
          <button
              onClick={onBack}
              className="bg-[#1CA1A6] hover:bg-[#1CA1A6]/90 text-white p-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Stats Dashboard */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#0B2545]">{orderStats.total}</div>
              <div className="text-sm text-[#0B2545]/70">Total Orders</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#FF7F6B]">{orderStats.ordered}</div>
              <div className="text-sm text-[#0B2545]/70">New Orders</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#1CA1A6]">{orderStats.preparing}</div>
              <div className="text-sm text-[#0B2545]/70">Preparing</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#1CA1A6]">{orderStats.done}</div>
              <div className="text-sm text-[#0B2545]/70">Ready</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#FF7F6B]">{orderStats.delivering}</div>
              <div className="text-sm text-[#0B2545]/70">Delivering</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#0B2545]">{orderStats.delivered}</div>
              <div className="text-sm text-[#0B2545]/70">Delivered</div>
            </div>
          </div>

          {/* Priority Indicators */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#FF7F6B]/20 px-3 py-1 rounded-full">
              <span className="text-[#FF7F6B] font-semibold">{orderStats.urgent} Urgent</span>
            </div>
            <div className="bg-[#1CA1A6]/20 px-3 py-1 rounded-full">
              <span className="text-[#1CA1A6] font-semibold">{orderStats.preparing} Preparing</span>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#0B2545]/60" />
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-[#F5E9DA] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1CA1A6] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0B2545]/60" />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-[#F5E9DA] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1CA1A6] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="ordered">New Orders</option>
                  <option value="preparing">Preparing</option>
                  <option value="done">Ready</option>
                  <option value="ready-to-deliver">Delivering</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border border-[#F5E9DA] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1CA1A6] focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const isEditing = editingOrder === order.id;

              return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1">
                              {isEditing ? (
                                  <input
                                      type="text"
                                      value={order.item}
                                      onChange={(e) => updateOrderField(order.id, 'item', e.target.value)}
                                      className="text-lg font-bold text-[#0B2545] border border-[#F5E9DA] rounded px-2 py-1 w-full"
                                  />
                              ) : (
                                  <h3 className="text-lg font-bold text-[#0B2545]">{order.item}</h3>
                              )}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                              {order.priority.toUpperCase()}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#0B2545]/70">
                            <div>
                              <span className="font-medium">Customer:</span> {order.customerName}
                            </div>
                            <div>
                              <span className="font-medium">Room:</span> {order.roomNumber}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {order.location}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {order.quantity}
                            </div>
                            <div>
                              <span className="font-medium">Ordered:</span> {order.orderTime}
                            </div>
                            <div>
                              <span className="font-medium">Est. Ready:</span>
                              {isEditing ? (
                                  <input
                                      type="text"
                                      value={order.estimatedTime}
                                      onChange={(e) => updateOrderTime(order.id, e.target.value)}
                                      className="ml-1 border border-[#F5E9DA] rounded px-2 py-1 text-xs w-20"
                                  />
                              ) : (
                                  <span className="ml-1">{order.estimatedTime}</span>
                              )}
                            </div>
                            <div>
                              <span className="font-medium">Order ID:</span> {order.id}
                            </div>
                            {order.specialInstructions && (
                                <div className="col-span-2 md:col-span-1">
                                  <span className="font-medium">Special:</span> {order.specialInstructions}
                                </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                              onClick={() => setEditingOrder(isEditing ? null : order.id)}
                              className="p-2 text-[#0B2545]/60 hover:text-[#0B2545] hover:bg-[#F5E9DA] rounded-lg transition-colors"
                          >
                            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Status Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-2 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor} flex items-center gap-2`}>
                            <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                            <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                          </div>
                        </div>

                        {isEditing && (
                            <div className="flex items-center gap-2">
                              <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as AdminOrder['status'])}
                                  className="border border-[#F5E9DA] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1CA1A6] focus:border-transparent"
                              >
                                <option value="ordered">Order Received</option>
                                <option value="preparing">Preparing</option>
                                <option value="done">Ready</option>
                                <option value="ready-to-deliver">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                              </select>
                              <button
                                  onClick={() => setEditingOrder(null)}
                                  className="bg-[#1CA1A6] text-white px-4 py-2 rounded-lg hover:bg-[#1CA1A6]/90 transition-colors flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="text-[#0B2545]/60 mb-2">No orders found</div>
                <div className="text-sm text-[#0B2545]/40">Try adjusting your search or filter criteria</div>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdminPanel;