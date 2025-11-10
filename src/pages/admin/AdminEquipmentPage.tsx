import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { Modal } from '../../components/shared/Modal';
import { EmptyState } from '../../components/shared/EmptyState';
import { useEquipmentStore } from '../../store/equipmentStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Laptop, Plus, Edit, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Equipment } from '../../types';

export const AdminEquipmentPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { equipment, initializeEquipment, addEquipment, updateEquipment, deleteEquipment } = useEquipmentStore();
  const { createNotification } = useNotificationStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    type: Equipment['type'];
    serialNumber: string;
    status: Equipment['status'];
    purchaseDate: string;
    condition: Equipment['condition'];
    notes: string;
  }>({
    name: '',
    type: 'laptop',
    serialNumber: '',
    status: 'available',
    purchaseDate: '',
    condition: 'excellent',
    notes: '',
  });

  useEffect(() => {
    initializeEquipment();
  }, [initializeEquipment]);

  const stats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    assigned: equipment.filter(e => e.status === 'assigned').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (editingItem) {
      updateEquipment(editingItem.id, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      createNotification({
        userId: currentUser.id,
        type: 'success',
        title: 'Equipment Updated',
        message: `Equipment ${formData.name} has been updated.`,
      });
    } else {
      const newEquipment: Equipment = {
        id: `eq-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addEquipment(newEquipment);
      createNotification({
        userId: currentUser.id,
        type: 'success',
        title: 'Equipment Added',
        message: `Equipment ${formData.name} has been added to inventory.`,
      });
    }

    closeModal();
  };

  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      serialNumber: item.serialNumber,
      status: item.status,
      purchaseDate: item.purchaseDate.split('T')[0],
      condition: item.condition,
      notes: item.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = (item: Equipment) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteEquipment(item.id);
      if (currentUser) {
        createNotification({
          userId: currentUser.id,
          type: 'success',
          title: 'Equipment Deleted',
          message: `Equipment ${item.name} has been deleted.`,
        });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      type: 'laptop',
      serialNumber: '',
      status: 'available',
      purchaseDate: '',
      condition: 'excellent',
      notes: '',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Equipment Management</h1>
            <p className="text-gray-600 mt-1">Manage company equipment inventory</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
              <p className="text-sm text-gray-600">Assigned</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </Card>
        </div>

        {/* Equipment List */}
        {equipment.length === 0 ? (
          <EmptyState
            icon={<Laptop className="w-12 h-12" />}
            title="No equipment found"
            description="Start by adding equipment to your inventory."
            action={
              <Button onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {equipment.map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <Laptop className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">SN: {item.serialNumber}</p>
                      </div>
                      <Badge status={item.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-semibold text-gray-900 capitalize">{item.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Condition</p>
                        <p className="font-semibold text-gray-900 capitalize">{item.condition}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Purchase Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(item.purchaseDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {item.assignedTo && (
                        <div>
                          <p className="text-gray-600">Assigned To</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Agent
                          </p>
                        </div>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-sm text-gray-600">{item.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingItem ? 'Edit Equipment' : 'Add Equipment'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Equipment Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { value: 'laptop', label: 'Laptop' },
                { value: 'phone', label: 'Phone' },
                { value: 'tablet', label: 'Tablet' },
                { value: 'camera', label: 'Camera' },
                { value: 'vehicle', label: 'Vehicle' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />

            <Input
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              required
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'retired', label: 'Retired' },
              ]}
              required
            />

            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              required
            />

            <Select
              label="Condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
              options={[
                { value: 'excellent', label: 'Excellent' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' },
              ]}
              required
            />

            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update' : 'Add'} Equipment
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};
