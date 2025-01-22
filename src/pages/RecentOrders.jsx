import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, items')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const recentOrderItems = data.map(order => {
        return order.items.map(item => ({
          name: item.name,
          imageUrl: item.image_url
        }));
      });

      setOrders(recentOrderItems);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h1>
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div>
                {order.map((item, idx) => (
                  <div key={idx} className="flex items-center mb-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                    <p className="text-lg font-medium text-gray-800">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No recent orders found.</p>
        )}
      </div>
    </div>
  );
}

export default RecentOrders;
