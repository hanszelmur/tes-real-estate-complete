import React, { useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { EmptyState } from '../../components/shared/EmptyState';
import { useContractStore } from '../../store/contractStore';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { FileText, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

export const CustomerContractsPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { contracts, initializeContracts } = useContractStore();
  const { properties, initializeProperties } = usePropertyStore();

  useEffect(() => {
    initializeContracts();
    initializeProperties();
  }, [initializeContracts, initializeProperties]);

  const customerContracts = currentUser
    ? contracts.filter(c => c.customerId === currentUser.id)
    : [];

  const getProperty = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  const getStatusBadge = (status: string) => {
    return <Badge status={status} />;
  };

  const activeContracts = customerContracts.filter(c => c.status === 'active');

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Contracts</h1>
          <p className="text-gray-600 mt-1">View and manage your rental contracts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{activeContracts.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{customerContracts.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contracts List */}
        {customerContracts.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="No contracts found"
            description="You don't have any contracts yet. Book a property to get started."
          />
        ) : (
          <div className="space-y-4">
            {customerContracts.map((contract) => {
              const property = getProperty(contract.propertyId);
              return (
                <Card key={contract.id}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {property?.title || 'Property'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Contract: {contract.contractNumber}
                        </p>
                      </div>
                      {getStatusBadge(contract.status)}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(contract.startDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(contract.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {contract.signedDate && (
                        <div>
                          <p className="text-gray-600">Signed Date</p>
                          <p className="font-semibold text-gray-900">
                            {format(new Date(contract.signedDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {contract.status}
                        </p>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Contract Terms</p>
                      <p className="text-sm text-gray-600">{contract.terms}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors">
                        <Eye className="w-4 h-4" />
                        View Contract
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
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
