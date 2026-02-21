import Razorpay from 'razorpay';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: {
    onPaymentSuccess: (response: any) => void;
    onPaymentError: (error: any) => void;
  };
  prefill?: {
    name?: string;
    username?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
}

export const loadRazorpay = (): Promise<typeof Razorpay> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve((window as any).Razorpay);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayPayment = async (options: RazorpayOptions) => {
  try {
    const Razorpay = await loadRazorpay();
    
    const razorpay = new Razorpay({
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.order_id,
      handler: function(response: any) {
        options.handler.onPaymentSuccess(response);
      },
      prefill: options.prefill,
      theme: options.theme || {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function() {
          options.handler.onPaymentError({ error: 'Payment cancelled by user' });
        }
      }
    });

    razorpay.open();
  } catch (error) {
    options.handler.onPaymentError(error);
  }
};

export const verifyPayment = async (
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  assessmentId: string
) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        assessmentId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

export const createOrder = async (assessmentId: string) => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assessmentId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};
