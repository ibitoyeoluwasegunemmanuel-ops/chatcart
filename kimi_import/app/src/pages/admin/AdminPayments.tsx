import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, useCurrency } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Wallet,
  Check,
  X,
  Image as ImageIcon,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function AdminPayments() {
  const { orders, confirmPayment, getPendingPayments } = useStore();
  const { formatPrice } = useCurrency();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);

  const pendingPayments = getPendingPayments();
  const allPayments = orders.filter(o => o.paymentProof);

  const handleConfirm = (orderId: string) => {
    confirmPayment(orderId);
    toast.success('Payment confirmed successfully');
    // In production, this would also send email notification
  };

  const handleReject = (_orderId: string) => {
    // In production, this would update order status and notify customer
    toast.info('Payment rejected. Customer will be notified.');
  };

  const viewProof = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowProofModal(true);
  };

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payment_uploaded':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200"><Clock className="mr-1 h-3 w-3" />Awaiting Confirmation</Badge>;
      case 'payment_confirmed':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200"><Check className="mr-1 h-3 w-3" />Confirmed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and confirm manual bank transfer payments
          </p>
        </div>
        <Badge variant="secondary" className="h-8 px-3">
          <AlertCircle className="mr-2 h-4 w-4" />
          {pendingPayments.length} Pending
        </Badge>
      </motion.div>

      {/* Pending Payments */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Confirmations
            </CardTitle>
            <CardDescription>
              Payments awaiting your review and confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingPayments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending payments</p>
                <p className="text-sm">All payments have been processed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerName} • {order.customerEmail}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{formatPrice(order.totalPrice)}</p>
                        <p className="text-sm text-muted-foreground">{order.productName}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewProof(order.id)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Proof
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleConfirm(order.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Confirm Payment
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(order.id)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* All Payment History */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All payment records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium">{order.id}</td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold">{formatPrice(order.totalPrice)}</td>
                      <td className="px-4 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {order.paymentProof?.uploadedAt && new Date(order.paymentProof.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewProof(order.id)}
                        >
                          <ImageIcon className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Proof Modal */}
      {showProofModal && selectedOrderData?.paymentProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Proof</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowProofModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedOrderData.paymentProof.imageUrl}
                  alt="Payment Proof"
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrderData.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatPrice(selectedOrderData.totalPrice)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrderData.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">
                    {new Date(selectedOrderData.paymentProof.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedOrderData.status === 'payment_uploaded' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowProofModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => {
                      handleConfirm(selectedOrderData.id);
                      setShowProofModal(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Payment
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
