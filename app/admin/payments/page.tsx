'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, LoaderCircle, Search, ShieldCheck, Ticket, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Payment } from '@/lib/api/types';
import { toUserMessage } from '@/lib/api/errors';
import { queryKeys } from '@/lib/query/keys';
import { paymentService } from '@/lib/services/payment.service';
import { formatCurrency, formatDateTime, formatSeatLabels } from '@/lib/utils/format';

type StatusFilter = Payment['status'] | 'ALL';

const statusLabels: Record<Payment['status'], string> = {
  PENDING_REVIEW: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

const methodLabels: Record<Payment['paymentMethod'], string> = {
  KBZPAY: 'KBZPay',
  WAVEPAY: 'WavePay',
};

const statusTones = {
  PENDING_REVIEW: 'neutral',
  APPROVED: 'success',
  REJECTED: 'danger',
  EXPIRED: 'danger',
} as const;

function PaymentStatusBadge({ status }: { status: Payment['status'] }) {
  return (
    <StatusBadge tone={statusTones[status]} className={status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' : undefined}>
      {statusLabels[status]}
    </StatusBadge>
  );
}

function ReviewDetailRow({ label, children, amount = false }: { label: string; children: ReactNode; amount?: boolean }) {
  return (
    <div className="flex justify-between gap-4 p-3 text-sm">
      <span className={amount ? 'font-semibold' : 'text-muted-foreground'}>{label}</span>
      <span className={amount ? 'text-base font-bold text-brand' : 'text-right font-medium'}>{children}</span>
    </div>
  );
}

function PaymentReviewDialog({ payment }: { payment: Payment }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const review = useMutation({
    mutationFn: (input: { decision: 'APPROVE' } | { decision: 'REJECT'; reason: string }) => paymentService.review(payment.id, input),
    onSuccess: (result) => {
      toast.success(`Payment ${result.status.toLowerCase()}`);
      setOpen(false);
      setReason('');
      void queryClient.invalidateQueries({ queryKey: queryKeys.payments });
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
  const pending = payment.status === 'PENDING_REVIEW';
  const proofUrl = paymentService.screenshotUrl(payment.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-lg">
          <Eye className="h-4 w-4" /> Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="border-b border-border px-6 py-5 pr-12">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle>Payment order #{payment.id.slice(0, 8).toUpperCase()}</DialogTitle>
            <PaymentStatusBadge status={payment.status} />
          </div>
        </DialogHeader>

        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order details</h3>
              <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
                <ReviewDetailRow label="Customer">{payment.user?.name ?? payment.user?.email ?? 'Unknown user'}</ReviewDetailRow>
                <ReviewDetailRow label="Concert">{payment.reservation.concert.title}</ReviewDetailRow>
                <ReviewDetailRow label="Ticket / Seats">
                  {payment.reservation.ticket?.type ?? 'Legacy'} · {formatSeatLabels(payment.reservation.seats)}
                </ReviewDetailRow>
                <ReviewDetailRow label="Payment type">{methodLabels[payment.paymentMethod]}</ReviewDetailRow>
                <ReviewDetailRow label="Submitted">{formatDateTime(payment.submittedAt)}</ReviewDetailRow>
                <ReviewDetailRow amount label="Amount">
                  {formatCurrency(payment.reservation.totalAmount ?? 0)}
                </ReviewDetailRow>
              </div>
            </section>

            {payment.rejectionReason ? (
              <div className="rounded-xl bg-danger-muted p-4 text-sm text-danger">
                <p className="font-semibold">Rejection reason</p>
                <p className="mt-1">{payment.rejectionReason}</p>
              </div>
            ) : null}

            {pending ? (
              <section className="space-y-3 border-t border-border pt-5">
                <div>
                  <label htmlFor={`reason-${payment.id}`} className="text-sm font-semibold">
                    Rejection reason
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">Only required when rejecting this order.</p>
                </div>
                <Input id={`reason-${payment.id}`} value={reason} maxLength={500} onChange={(event) => setReason(event.target.value)} placeholder="Explain why the receipt cannot be approved" />
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="destructive" disabled={review.isPending || reason.trim().length < 3} onClick={() => review.mutate({ decision: 'REJECT', reason: reason.trim() })}>
                    <XCircle className="h-4 w-4" /> Reject payment
                  </Button>
                  <Button disabled={review.isPending} onClick={() => review.mutate({ decision: 'APPROVE' })}>
                    {review.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Approve payment
                  </Button>
                </div>
              </section>
            ) : null}
          </div>

          <aside>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment receipt</h3>
            <div
              className="mt-3 aspect-[4/4] rounded-2xl border border-border bg-muted bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${proofUrl})` }}
              role="img"
              aria-label="Uploaded payment receipt"
            />
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPaymentsPage() {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const payments = useQuery({
    queryKey: queryKeys.paymentList(status, page),
    queryFn: () => paymentService.list({ status: status === 'ALL' ? undefined : status, page }),
  });
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return payments.data?.items ?? [];

    return (payments.data?.items ?? []).filter((payment) => {
      const searchableValues = [payment.id, payment.user?.name, payment.user?.email, payment.reservation.concert.title, methodLabels[payment.paymentMethod]];
      return searchableValues.some((value) => value?.toLowerCase().includes(term));
    });
  }, [payments.data?.items, search]);
  const totalPages = Math.max(1, Math.ceil((payments.data?.total ?? 0) / (payments.data?.limit ?? 20)));

  function changeStatus(next: StatusFilter) {
    setStatus(next);
    setPage(1);
  }

  if (payments.isLoading) {
    return <LoadingState />;
  }

  if (payments.isError) {
    return <ErrorState message={toUserMessage(payments.error)} onRetry={() => void payments.refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 ">
        <AdminPageHeader title="Payment Management" description="Review manual payment orders and confirm reserved seats." />
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search order, customer, concert..." aria-label="Search payments" />
          </div>
          <Select value={status} onValueChange={(value) => changeStatus(value as StatusFilter)}>
            <SelectTrigger className="sm:w-44" aria-label="Filter payment status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING_REVIEW">Pending review</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow className="hover:bg-transparent">
              <TableHead>Order</TableHead>
              <TableHead>Customer / Event</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center">
                  <Ticket className="mx-auto h-7 w-7 text-muted-foreground" />
                  <p className="mt-3 font-medium">No payment orders found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try another search or status filter.</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <p className="font-mono text-xs font-semibold">#{payment.id.slice(0, 8).toUpperCase()}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {payment.reservation.quantity} seat{payment.reservation.quantity > 1 ? 's' : ''}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-52 truncate font-medium">{payment.user?.name ?? payment.user?.email ?? 'Unknown user'}</p>
                    <p className="mt-1 max-w-52 truncate text-xs text-muted-foreground">{payment.reservation.concert.title}</p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                      {methodLabels[payment.paymentMethod]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{payment.reservation.ticket?.type ?? 'Legacy'}</p>
                    <p className="mt-1 max-w-40 truncate text-xs text-muted-foreground">{formatSeatLabels(payment.reservation.seats)}</p>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(payment.reservation.totalAmount ?? 0)}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(payment.submittedAt)}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <PaymentReviewDialog payment={payment} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {filtered.length} of {payments.data?.total ?? 0} orders
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="px-2 text-xs font-medium text-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
