import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { EmptyState } from '../../components/shared/EmptyState';
import { usePaymentStore } from '../../store/paymentStore';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { CreditCard, Download, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';

export const CustomerPaymentsPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { payments, initializePayments } = usePaymentStore();
  const { properties, initializeProperties } = usePropertyStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    initializePayments();
    initializeProperties();
  }, [initializePayments, initializeProperties]);

  const customerPayments = currentUser
    ? payments.filter(p => p.customerId === currentUser.id)
    : [];

  const filteredPayments = filterStatus === 'all'
    ? customerPayments
    : customerPayments.filter(p => p.status === filterStatus);

  const getProperty = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  const getStatusBadge = (status: string) => {
    return <Badge status={status} />;
  };

  const totalPaid = customerPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = customerPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = customerPayments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">View your payment history and download receipts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₱{totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₱{totalPending.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₱{totalOverdue.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'paid'
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('overdue')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'overdue'
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overdue
            </button>
          </div>
        </Card>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="w-12 h-12" />}
            title="No payments found"
            description={
              filterStatus === 'all'
                ? "You don't have any payment records yet."
                : `No ${filterStatus} payments found.`
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => {
              const property = getProperty(payment.propertyId);
              return (
                <Card key={payment.id}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {property?.title || 'Property'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Receipt: {payment.receiptNumber}
                          </p>
                        </div>
                        {getStatusBadge(payment.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p className="font-semibold text-gray-900">
                            ₱{payment.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Due Date</p>
                          <p className="font-semibold text-gray-900">
                            {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        {payment.paymentDate && (
                          <div>
                            <p className="text-gray-600">Paid On</p>
                            <p className="font-semibold text-gray-900">
                              {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        )}
                        {payment.paymentMethod && (
                          <div>
                            <p className="text-gray-600">Method</p>
                            <p className="font-semibold text-gray-900 capitalize">
                              {payment.paymentMethod.replace('_', ' ')}
                            </p>
                          </div>
                        )}
                      </div>

                      {payment.notes && (
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                          <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {payment.notes}
                        </p>
                      )}
                    </div>

                    {payment.status === 'paid' && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors whitespace-nowrap">
                        <Download className="w-4 h-4" />
                        Download Receipt
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
