import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Avatar } from '../../components/shared/Avatar';
import { toast } from '../../components/shared/Toast';
import { useAuthStore } from '../../store/authStore';
import { notificationService } from '../../services/notificationService';

export const AgentApprovalsPage: React.FC = () => {
  const users = useAuthStore(state => state.users);
  const updateUser = useAuthStore(state => state.updateUser);

  const pendingAgents = users.filter(u => u.role === 'agent' && u.status === 'pending');

  const handleApprove = (userId: string) => {
    updateUser(userId, { status: 'active' });
    notificationService.notifyAgentApproved(userId);
    toast.success('Agent approved successfully');
  };

  const handleReject = (userId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    updateUser(userId, { status: 'rejected' });
    notificationService.notifyAgentRejected(userId, reason);
    toast.success('Agent application rejected');
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Agent Approvals</h1>

        {pendingAgents.length === 0 ? (
          <Card>
            <div className="p-8 text-center text-gray-600">No pending agent applications</div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingAgents.map((agent) => (
              <Card key={agent.id}>
                <div className="p-6 flex items-center gap-4">
                  <Avatar name={agent.name} size="lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.email}</p>
                    <p className="text-sm text-gray-600">{agent.phone}</p>
                    <p className="text-sm text-gray-600">License: {agent.licenseNumber}</p>
                    <p className="text-sm text-gray-600">Agency: {agent.agency}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleApprove(agent.id)}>Approve</Button>
                    <Button variant="danger" onClick={() => handleReject(agent.id)}>Reject</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
