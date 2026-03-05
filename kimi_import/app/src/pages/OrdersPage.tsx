import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, useCurrency } from '@/store';
import type { Order, OrderStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Search,
  ShoppingCart,
  Package,
  User,
  Mail,
  Calendar,
  ArrowUpRight,
  Filter,
  Image as ImageIcon,
  Check,
  Clock,
  Upload,
  Building2,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const statusConfig: Record<OrderStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: ShoppingCart,
  },
  awaiting_payment: {
    label: 'Awaiting Payment',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
  },
  payment_uploaded: {
    label: 'Payment Uploaded',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Upload,
  },
  payment_confirmed: {
    label: 'Payment Confirmed',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: Check,
  },
  processing: {
    label: 'Processing',
    className: 'bg-violet-100 text-violet-700 border-violet-200',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    icon: ArrowUpRight,
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: Package,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: ShoppingCart,
  },
};

export function OrdersPage() {
  const { orders, updateOrderStatus, uploadPaymentProof, confirmPayment, user } = useStore();
  const { formatPrice } = useCurrency();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentImage, setPaymentImage] = useState<string>('');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order status updated to ${newStatus}`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleUploadPayment = () => {
    if (!selectedOrder || !paymentImage) return;
    uploadPaymentProof(selectedOrder.id, paymentImage);
    toast.success('Payment proof uploaded!');
    setShowPaymentModal(false);
    setPaymentImage('');
  };

  const handleConfirmPayment = (orderId: string) => {
    confirmPayment(orderId);
    toast.success('Payment confirmed! Order is now processing.');
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        {(['all', 'pending', 'awaiting_payment', 'payment_uploaded', 'payment_confirmed', 'processing', 'shipped', 'delivered'] as const).map(
          (status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? 'gradient-primary' : ''}
            >
              {status === 'all' ? 'All Orders' : statusConfig[status]?.label}
              <Badge variant="secondary" className="ml-2">
                {statusCounts[status] || 0}
              </Badge>
            </Button>
          )
        )}
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, customer, or product..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Orders will appear here when customers make purchases'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => {
                      const status = statusConfig[order.status];
                      const StatusIcon = status.icon;
                      
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-4 py-4">
                            <span className="font-medium">{order.id}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="line-clamp-1">{order.productName}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-medium">{formatPrice(order.totalPrice)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className={status.className}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              {order.status === 'awaiting_payment' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowPaymentModal(true);
                                  }}
                                >
                                  <Upload className="mr-1 h-3 w-3" />
                                  Upload Proof
                                </Button>
                              )}
                              {order.status === 'payment_uploaded' && (
                                <Button
                                  size="sm"
                                  className="bg-emerald-500 hover:bg-emerald-600"
                                  onClick={() => handleConfirmPayment(order.id)}
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Confirm
                                </Button>
                              )}
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
                                  <SelectItem value="payment_uploaded">Payment Uploaded</SelectItem>
                                  <SelectItem value="payment_confirmed">Payment Confirmed</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="text-lg font-bold">{selectedOrder.id}</p>
                </div>
                <Badge variant="outline" className={statusConfig[selectedOrder.status].className}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>

              {/* Bank Details (for manual transfer) */}
              {selectedOrder.status === 'awaiting_payment' && user?.bankDetails && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-amber-600" />
                    Payment Instructions
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Name:</span>
                      <span className="font-medium">{user.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Name:</span>
                      <span className="font-medium">{user.bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number:</span>
                      <span className="font-medium">{user.bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-amber-200">
                      <span className="text-muted-foreground">Amount to Pay:</span>
                      <span className="font-bold text-lg text-amber-600">
                        {formatPrice(selectedOrder.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Proof */}
              {selectedOrder.paymentProof && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Payment Proof</h4>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={selectedOrder.paymentProof.imageUrl}
                      alt="Payment Proof"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {new Date(selectedOrder.paymentProof.uploadedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Details
                </h4>
                <div className="bg-muted rounded-lg p-4">
                  <p className="font-medium">{selectedOrder.productName}</p>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">
                      Quantity: {selectedOrder.quantity}
                    </span>
                    <span className="font-bold text-primary">
                      {formatPrice(selectedOrder.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Order Timeline
                </h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Placed</span>
                    <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-3">
                <h4 className="font-semibold">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {(['pending', 'awaiting_payment', 'payment_uploaded', 'payment_confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={selectedOrder.status === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        className={selectedOrder.status === status ? 'gradient-primary' : ''}
                      >
                        {statusConfig[status].label}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Upload Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Upload Payment Proof</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="font-medium">{selectedOrder.id}</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {formatPrice(selectedOrder.totalPrice)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Payment Proof Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <Input
                  placeholder="Or enter image URL"
                  value={paymentImage}
                  onChange={(e) => setPaymentImage(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gradient-primary" onClick={handleUploadPayment}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Proof
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
