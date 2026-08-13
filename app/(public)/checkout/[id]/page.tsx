import type { Metadata } from 'next';
import { PaymentCheckout } from '@/components/checkout/payment-checkout';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your concert ticket payment and submit the receipt for review.',
};

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;

  return (
    <section aria-label="Checkout">
      <PaymentCheckout
        reservationId={id}
        heading={
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Secure checkout</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight" id="checkout-heading">
              Complete your payment
            </h1>
          </div>
        }
      />
    </section>
  );
}
