import { supabase } from './supabase'; 

export const initiateEsewaPayment = async (order) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  await updateOrderPaymentStatus(order.id, 'completed', 'esewa');
  
  return {
    success: true,
    message: 'Payment processed successfully',
    transactionId: `ESEWA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};

export const initiateKhaltiPayment = async (order) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  await updateOrderPaymentStatus(order.id, 'completed', 'khalti');
  
  return {
    success: true,
    message: 'Payment processed successfully',
    transactionId: `KHALTI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};

const updateOrderPaymentStatus = async (orderId, status, method) => {
  const { error } = await supabase
    .from('orders')
    .update({ 
      payment_status: status,
      payment_method: method,
      status: status === 'completed' ? 'preparing' : 'pending'
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
