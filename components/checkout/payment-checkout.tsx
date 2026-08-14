'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  CheckCircle2,
  Clock3,
  FileImage,
  Info,
  LoaderCircle,
  ShieldCheck,
  Smartphone,
  TicketCheck,
  UploadCloud,
  WalletCards,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ReservationCountdown } from '@/components/checkout/reservation-countdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toUserMessage } from '@/lib/api/errors';
import type { PaymentMethodId, Reservation } from '@/lib/api/types';
import { queryKeys } from '@/lib/query/keys';
import { paymentService } from '@/lib/services/payment.service';
import { reservationService } from '@/lib/services/reservation.service';
import { formatCurrency, formatSeatLabels } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { useAuthModal } from '@/providers/auth-modal-provider';

const MAX_BYTES = 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PAYMENT_METHODS = {
  KBZPAY: { icon: WalletCards, name: 'KBZPay' },
  WAVEPAY: { icon: Smartphone, name: 'WavePay' },
} satisfies Record<PaymentMethodId, { icon: typeof WalletCards; name: string }>;

function getPaymentStatus(status: Reservation['status'], expired: boolean) {
  if (expired) {
    return {
      icon: Clock3,
      tone: 'bg-danger-muted text-danger',
      title: 'Reservation hold expired',
      description: 'The selected seats have been released. Choose your seats again to start a new checkout.',
    };
  }

  if (status === 'UNDER_REVIEW') {
    return {
      icon: Clock3,
      tone: 'bg-amber-100 text-amber-700',
      title: 'Payment is under review',
      description: 'An admin will verify your receipt. Your selected seats remain held during review.',
    };
  }

  if (status === 'PURCHASED') {
    return {
      icon: CheckCircle2,
      tone: 'bg-emerald-100 text-emerald-700',
      title: 'Payment approved',
      description: 'You can review the latest booking details in My Tickets.',
    };
  }

  return {
    icon: Info,
    tone: 'bg-danger-muted text-danger',
    title: `Payment ${status.toLowerCase()}`,
    description: 'You can review the latest booking details in My Tickets.',
  };
}

function getStepMarkerTone(complete: boolean, active: boolean) {
  if (complete) return 'border-emerald-500 bg-emerald-500 text-white';
  if (active) return 'border-brand bg-brand text-white';
  return 'border-border bg-white text-muted-foreground';
}

function CheckoutSteps({ underReview }: { underReview: boolean }) {
  const steps = [
    { label: 'Tickets', complete: true },
    { label: 'Payment', complete: underReview },
    { label: 'Review', complete: false },
  ];
  return (
    <ol className="flex w-full items-center" aria-label="Checkout progress">
      {steps.map((step, index) => {
        const active = underReview ? index === 2 : index === 1;
        const hasNextStep = index < steps.length - 1;
        const markerTone = getStepMarkerTone(step.complete, active);

        return (
          <li key={step.label} className={cn('flex min-w-0 items-center', hasNextStep ? 'flex-1' : 'shrink-0')}>
            <div className="relative z-10 flex shrink-0 items-center gap-2 bg-white pr-2.5 sm:pr-3">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold sm:h-9 sm:w-9 sm:text-sm',
                  markerTone,
                )}
              >
                {step.complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden whitespace-nowrap text-sm font-semibold sm:inline',
                  active || step.complete ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>
            {hasNextStep ? (
              <span
                aria-hidden="true"
                className={cn('mr-2.5 h-px min-w-4 flex-1 sm:mr-3', step.complete ? 'bg-emerald-400' : 'bg-border')}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function PaymentCheckout({ reservationId, heading }: { reservationId: string; heading: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: authLoading } = useCurrentUser();
  const { openSignIn } = useAuthModal();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('KBZPAY');
  const [file, setFile] = useState<File | null>(null);
  const [holdExpired, setHoldExpired] = useState(false);
  const reservationQuery = useQuery({
    queryKey: queryKeys.reservation(reservationId),
    queryFn: () => reservationService.getReservation(reservationId),
    enabled: Boolean(user),
  });
  const configQuery = useQuery({
    queryKey: queryKeys.paymentConfig,
    queryFn: paymentService.getConfig,
    enabled: Boolean(user),
  });
  const upload = useMutation({
    mutationFn: () => reservationService.submitPayment(reservationId, paymentMethod, file!),
    onSuccess: () => {
      toast.success('Payment submitted for admin review');
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservation(reservationId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservationHistory });
      setFile(null);
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const reservation = reservationQuery.data;
  const selectedMethod = configQuery.data?.methods.find((method) => method.id === paymentMethod) ?? configQuery.data?.methods[0];
  const handleExpired = useCallback(() => {
    setHoldExpired(true);
    setFile(null);
    toast.error('Reservation expired. Please select your seats again.');
    void queryClient.invalidateQueries({ queryKey: queryKeys.reservation(reservationId) });
    router.refresh();
  }, [queryClient, reservationId, router]);

  function selectFile(next: File | undefined) {
    if (!next) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(next.type)) {
      setFile(null);
      toast.error('Only JPEG, PNG, or WebP images are allowed');
      return;
    }
    if (next.size > MAX_BYTES) {
      setFile(null);
      toast.error('Screenshot must be 1 MB or smaller');
      return;
    }
    setFile(next);
  }

  if (authLoading)
    return <LoadingState />;
  if (!user)
    return (
      <Card className="mx-auto max-w-lg rounded-3xl p-8 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-brand" />
        <h1 className="mt-4 text-xl font-semibold">Sign in to continue checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your payment proof and ticket details stay private to your account.</p>
        <Button className="mt-5 rounded-xl" onClick={openSignIn}>
          Sign in
        </Button>
      </Card>
    );
  if (reservationQuery.isLoading)
    return <LoadingState />;
  if (reservationQuery.isError)
    return <ErrorState message={toUserMessage(reservationQuery.error)} onRetry={() => void reservationQuery.refetch()} />;
  if (!reservation)
    return (
      <div className="flex min-h-[calc(100dvh-8rem)] w-full flex-col items-center justify-center text-center" role="alert">
        <p className="text-sm text-danger">Reservation unavailable.</p>
        <Button asChild className="mt-4">
          <Link href="/my-tickets">My Tickets</Link>
        </Button>
      </div>
    );

  const awaitingUpload = reservation.status === 'PENDING';
  const canPay = awaitingUpload && !holdExpired;
  const underReview = reservation.status === 'UNDER_REVIEW';
  const isExpired = holdExpired || reservation.status === 'EXPIRED';
  const submittedMethod = reservation.payment?.paymentMethod;
  const paymentLabel = canPay ? selectedMethod?.name : submittedMethod ? PAYMENT_METHODS[submittedMethod].name : 'Not submitted';
  const statusView = getPaymentStatus(reservation.status, isExpired);
  const StatusIcon = statusView.icon;
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="rounded-3xl border border-brand/10 bg-white px-5 py-5 shadow-sm sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {heading}
          {canPay ? <ReservationCountdown expiresAt={reservation.expiresAt} onExpire={handleExpired} /> : null}
        </div>
        <div className="mt-6 max-w-xl">
          <CheckoutSteps underReview={underReview} />
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden rounded-3xl border-brand/10 shadow-md shadow-brand/5">
          <CardHeader className="border-b border-brand/10 bg-violet-50/60 px-5 py-5 sm:px-7">
            <CardTitle>{canPay ? 'Choose how you want to pay' : 'Payment status'}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {canPay ? 'Transfer the exact amount using one method, then upload your receipt.' : 'Your submitted payment and reserved seats are tracked here.'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-5 sm:p-7">
            {canPay ? (
              <>
                <fieldset>
                  <legend className="text-sm font-semibold">1. Select payment type</legend>
                  {configQuery.isLoading ? (
                    <LoadingState className="min-h-32" />
                  ) : configQuery.isError ? (
                    <ErrorState className="min-h-32" message={toUserMessage(configQuery.error)} onRetry={() => void configQuery.refetch()} />
                  ) : (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment type">
                      {configQuery.data?.methods.map((method) => {
                        const Icon = PAYMENT_METHODS[method.id].icon;
                        const selected = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setPaymentMethod(method.id)}
                            className={cn(
                              'relative flex items-center gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                              selected ? 'border-brand bg-brand/5 shadow-sm' : 'border-border bg-white hover:border-brand/35',
                            )}
                          >
                            <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', selected ? 'bg-brand text-white' : 'bg-muted text-muted-foreground')}>
                              <Icon className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block font-semibold">{method.name}</span>
                              <span className="text-xs text-muted-foreground">Mobile wallet transfer</span>
                            </span>
                            <span className={cn('absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border', selected ? 'border-brand bg-brand text-white' : 'border-border')}>
                              {selected ? <Check className="h-3 w-3" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </fieldset>

                <section aria-labelledby="payment-account-heading" className="rounded-2xl border border-brand/15 bg-brand/[0.045] p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Info className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 id="payment-account-heading" className="text-sm font-semibold">2. Payment Account Information</h2>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">Use this same account for both KBZPay and WavePay transfers.</p>
                      <div className="mt-4 grid gap-3 rounded-xl border border-brand/10 bg-white p-4 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Account Number</p>
                          <p className="mt-1 break-all font-semibold tracking-wide">09968213232</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Account Name</p>
                          <p className="mt-1 break-words font-semibold">Phyo Thura</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section aria-labelledby="upload-heading">
                  <h2 id="upload-heading" className="text-sm font-semibold">
                    3. Upload payment receipt
                  </h2>
                  {!file ? (
                    <label
                      htmlFor="payment-proof"
                      className="mt-3 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/25 bg-brand/[0.025] px-5 py-7 text-center transition hover:border-brand/50 hover:bg-brand/5 focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <UploadCloud className="h-6 w-6" />
                      </span>
                      <span className="mt-3 text-sm font-semibold">Choose your payment screenshot</span>
                      <span className="mt-1 text-xs text-muted-foreground">JPEG, PNG, or WebP · Maximum 1 MB</span>
                      <input id="payment-proof" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectFile(event.target.files?.[0])} />
                    </label>
                  ) : (
                    <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center">
                      <div
                        className="h-24 w-full shrink-0 rounded-xl bg-cover bg-center sm:w-28"
                        style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : undefined }}
                        role="img"
                        aria-label="Selected payment screenshot preview"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 font-semibold">
                          <FileImage className="h-4 w-4 text-emerald-600" />
                          <span className="truncate">{file.name}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · Ready to upload</p>
                      </div>
                      <Button type="button" size="icon" variant="ghost" aria-label="Remove selected screenshot" onClick={() => setFile(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </section>

                <Button className="h-13 w-full rounded-2xl text-base font-semibold shadow-lg shadow-brand/20" disabled={!file || !selectedMethod || upload.isPending} onClick={() => upload.mutate()}>
                  {upload.isPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" /> Uploading receipt...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Submit for review
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">Submitting confirms that the transfer details and receipt are correct.</p>
              </>
            ) : (
              <div className="py-4 text-center">
                <span className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full', statusView.tone)}>
                  <StatusIcon className="h-8 w-8" />
                </span>
                <h2 className="mt-5 text-xl font-bold">{statusView.title}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{statusView.description}</p>
                {reservation.payment?.rejectionReason ? (
                  <p className="mx-auto mt-4 max-w-md rounded-xl bg-danger-muted p-3 text-sm text-danger">Reason: {reservation.payment.rejectionReason}</p>
                ) : null}
                <Button asChild className="mt-6 rounded-xl">
                  <Link href={isExpired ? `/concerts/${reservation.concert.id}` : '/my-tickets'}>{isExpired ? 'Select seats again' : 'View My Tickets'}</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-brand/10 shadow-md shadow-brand/5 lg:sticky lg:top-24">
          <CardHeader className="border-b border-brand/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <TicketCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Order summary</p>
                <CardTitle className="mt-1 line-clamp-1">{reservation.concert.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5 text-sm sm:p-6">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Ticket</span>
              <span className="font-medium">{reservation.ticket?.type ?? 'Legacy'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Seats</span>
              <span className="max-w-56 text-right font-medium">{formatSeatLabels(reservation.seats)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">{reservation.quantity}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium">{paymentLabel}</span>
            </div>
            <div className="flex items-center justify-between border-t border-brand/10 pt-5 text-lg font-bold">
              <span>Total</span>
              <span className="text-brand">{formatCurrency(reservation.totalAmount ?? 0)}</span>
            </div>
            {canPay || underReview ? (
              <div className="rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                <p className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" /> Your reservation is protected
                </p>
                <p className="mt-1 pl-6 text-emerald-700">Seats stay held while the payment is reviewed.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
