import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../utils/supabase';
import { formatCurrency } from '../utils/formatCurrency';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function OrderStatus() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 2000);
    const subscription = supabase
      .channel('order_status_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      }, (payload) => {
        setOrder(payload.new);
      })
      .subscribe();

   
    return () => {
      clearInterval(interval);  
      subscription.unsubscribe();  
    };
  }, [orderId]); 

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);  
    } catch (error) {
      toast.error('Error loading order status');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'preparing':
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'ready':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'completed':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleBack = () => {
    navigate(-1); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Order Not Found</h1>
        <p className="text-gray-600 mt-2">The order you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Status</h1>
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.status)}
            <span className="text-lg font-semibold capitalize">{order.status}</span>
          </div>
        </div>

        <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Menu
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Table Number</p>
                <p className="font-medium">{order.table_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Customer Name</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Items Ordered</h2>
            <div className="space-y-2">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No items in this order.</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total Amount</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <p>Payment Status</p>
              <p className="capitalize">{order.payment_status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;
