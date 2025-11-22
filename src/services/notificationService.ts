import { useNotificationStore } from '../store/notificationStore';

export const notificationService = {
  // Customer books appointment → Notify agent
  notifyAgentNewBooking: (agentId: string, customerName: string, propertyTitle: string, appointmentId: string) => {
    useNotificationStore.getState().createNotification({
      userId: agentId,
      type: 'info',
      title: 'New Appointment Request',
      message: `${customerName} has requested to view ${propertyTitle}`,
      link: `/agent/appointments/${appointmentId}`,
    });
  },

  // Agent confirms appointment → Notify customer
  notifyCustomerConfirmed: (customerId: string, propertyTitle: string, appointmentId: string) => {
    useNotificationStore.getState().createNotification({
      userId: customerId,
      type: 'success',
      title: 'Appointment Confirmed',
      message: `Your appointment to view ${propertyTitle} has been confirmed`,
      link: `/customer/bookings/${appointmentId}`,
    });
  },

  // Agent completes appointment → Notify customer
  notifyCustomerCompleted: (customerId: string, propertyTitle: string, appointmentId: string) => {
    useNotificationStore.getState().createNotification({
      userId: customerId,
      type: 'success',
      title: 'Appointment Completed',
      message: `Your viewing of ${propertyTitle} is complete. Please leave a review!`,
      link: `/customer/bookings/${appointmentId}`,
    });
  },

  // Appointment cancelled → Notify other party
  notifyAppointmentCancelled: (userId: string, propertyTitle: string, reason: string, appointmentId: string) => {
    useNotificationStore.getState().createNotification({
      userId,
      type: 'warning',
      title: 'Appointment Cancelled',
      message: `Appointment for ${propertyTitle} has been cancelled. Reason: ${reason}`,
      link: `/customer/bookings/${appointmentId}`,
    });
  },

  // Agent submits property → Notify admin
  notifyAdminNewProperty: (adminId: string, agentName: string, propertyTitle: string) => {
    useNotificationStore.getState().createNotification({
      userId: adminId,
      type: 'info',
      title: 'New Property Submission',
      message: `${agentName} has submitted ${propertyTitle} for approval`,
      link: `/admin/properties`,
    });
  },

  // Admin approves property → Notify agent
  notifyAgentPropertyApproved: (agentId: string, propertyTitle: string) => {
    useNotificationStore.getState().createNotification({
      userId: agentId,
      type: 'success',
      title: 'Property Approved',
      message: `Your property ${propertyTitle} has been approved and is now visible to customers`,
      link: `/agent/properties`,
    });
  },

  // Admin rejects property → Notify agent
  notifyAgentPropertyRejected: (agentId: string, propertyTitle: string, reason: string) => {
    useNotificationStore.getState().createNotification({
      userId: agentId,
      type: 'error',
      title: 'Property Rejected',
      message: `Your property ${propertyTitle} has been rejected. Reason: ${reason}`,
      link: `/agent/properties`,
    });
  },

  // Admin approves agent → Notify agent
  notifyAgentApproved: (agentId: string) => {
    useNotificationStore.getState().createNotification({
      userId: agentId,
      type: 'success',
      title: 'Agent Application Approved',
      message: 'Congratulations! Your agent application has been approved. You can now start listing properties.',
      link: '/agent/dashboard',
    });
  },

  // Admin rejects agent → Notify agent
  notifyAgentRejected: (agentId: string, reason: string) => {
    useNotificationStore.getState().createNotification({
      userId: agentId,
      type: 'error',
      title: 'Agent Application Rejected',
      message: `Your agent application has been rejected. Reason: ${reason}`,
    });
  },

  // Customer leaves review → Notify agent
  notifyAgentNewReview: (agentId: string, customerName: string, propertyTitle: string, rating: number) => {
    useNotificationStore.getState().createNotification({
      userId: agentId,
      type: 'info',
      title: 'New Review',
      message: `${customerName} left a ${rating}-star review for ${propertyTitle}`,
      link: '/agent/performance',
    });
  },
};
