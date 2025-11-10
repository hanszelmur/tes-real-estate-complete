import React, { useState } from 'react';
import { Users, Search, Eye, Edit, UserX } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Avatar } from '../../components/shared/Avatar';
import { EmptyState } from '../../components/shared/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/shared/Toast';
import { formatDate } from '../../utils/helpers';
import type { UserRole } from '../../types';

type RoleFilter = 'all' | UserRole;

export const UserManagementPage: React.FC = () => {
  const users = useAuthStore(state => state.users);
  const updateUser = useAuthStore(state => state.updateUser);
  
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredUsers = [...users];
  
  if (roleFilter !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.role === roleFilter);
  }

  if (searchQuery) {
    filteredUsers = filteredUsers.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort by creation date (most recent first)
  filteredUsers.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const stats = {
    total: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    agents: users.filter(u => u.role === 'agent').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const handleView = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const details = [
      `Name: ${user.name}`,
      `Email: ${user.email}`,
      `Phone: ${user.phone}`,
      `Role: ${user.role}`,
      `Status: ${user.status}`,
      `Created: ${formatDate(user.createdAt)}`,
    ];

    if (user.role === 'agent') {
      details.push(`License: ${user.licenseNumber || 'N/A'}`);
      details.push(`Agency: ${user.agency || 'N/A'}`);
    }

    alert(details.join('\n'));
  };

  const handleEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('Edit user name:', user.name);
    if (newName && newName !== user.name) {
      updateUser(userId, { name: newName });
      toast.success('User updated successfully');
    }
  };

  const handleDeactivate = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'admin') {
      toast.error('Cannot deactivate admin users');
      return;
    }

    if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      updateUser(userId, { status: 'rejected' });
      toast.success('User deactivated successfully');
    }
  };

  const handleActivate = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    updateUser(userId, { status: 'active' });
    toast.success('User activated successfully');
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      customer: 'bg-blue-100 text-blue-800',
      agent: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
          Users Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Customers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.customers}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Agents</p>
              <p className="text-2xl font-bold text-purple-600">{stats.agents}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Admins</p>
              <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'customer', 'agent', 'admin'] as RoleFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
                roleFilter === f
                  ? 'bg-gold text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'All Users' : `${f}s`}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Users className="w-16 h-16" />}
            title="No users found"
            description={searchQuery ? 'Try adjusting your search query' : 'No users available'}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar name={user.name} size="sm" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleView(user.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(user.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeactivate(user.id)}
                              disabled={user.role === 'admin'}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleActivate(user.id)}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
