# TES Real Estate Web Application

A complete, fully functional real estate booking system with three distinct user roles (Customer, Agent, Admin) built with React, TypeScript, Vite, and Tailwind CSS.

## Features

### 🎨 Design
- Gold theme color (#D4AF37)
- Mobile-first responsive design
- Bottom navigation (< 1024px)
- Sidebar navigation (≥ 1024px)
- Clean, modern, professional UI

### 👥 User Roles

#### Customer Portal
- Browse and filter properties
- View property details with photos and agent information
- Book appointments (4-step wizard)
- Manage bookings
- Leave reviews after completed appointments
- Profile management

#### Agent Portal
- Dashboard with statistics
- Property management (add, edit, delete)
- Appointment management (confirm, complete)
- Performance analytics
- Agent approval workflow

#### Admin Portal
- System overview dashboard
- Agent approvals
- Property approvals
- User management
- Review moderation
- System statistics

## Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Date Formatting:** date-fns
- **Icons:** Lucide React
- **Data Persistence:** localStorage

## Demo Credentials

### Customer
- Email: `hans@tesrealestate.com`
- Password: `customer123`

### Agent
- Email: `juan@tesrealestate.com`
- Password: `agent123`

### Admin
- Email: `admin@tesrealestate.com`
- Password: `admin123`

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       
│   ├── auth/        # Authentication components
│   ├── customer/    # Customer-specific components
│   ├── agent/       # Agent-specific components
│   ├── admin/       # Admin-specific components
│   ├── shared/      # Reusable UI components
│   └── layout/      # Layout components (Sidebar, Header, etc.)
├── pages/           
│   ├── auth/        # Login, Register, Forgot Password
│   ├── customer/    # Customer portal pages
│   ├── agent/       # Agent portal pages
│   └── admin/       # Admin portal pages
├── hooks/           # Custom React hooks
├── store/           # Zustand stores
├── services/        # API services and utilities
├── utils/           # Helper functions and constants
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Key Features Implementation

### Authentication
- Role-based authentication and routing
- Protected routes with role checks
- localStorage-based session management

### State Management
- Zustand stores for auth, properties, appointments, reviews, and notifications
- Centralized state with persistence to localStorage

### Responsive Design
- Mobile-first approach
- Adaptive navigation (sidebar for desktop, bottom nav for mobile)
- Responsive grids and layouts

### Business Logic
- Agent approval workflow (pending → active/rejected)
- Property approval workflow (pending → active/rejected)
- Appointment lifecycle (pending → confirmed → completed/cancelled)
- Review system (only after completed appointments)
- Automatic notifications for key actions

## Demo Data

The application includes 6 pre-configured properties:
1. Modern Downtown Condo - Manila - ₱12M
2. Luxury Beach House - Boracay - ₱35M
3. Cozy Studio Apartment - Makati - ₱6M
4. Family Home with Garden - Quezon City - ₱18M
5. Penthouse with City View - BGC - ₱45M
6. Suburban Townhouse - Alabang - ₱15M

## Development

This is a prototype application using localStorage for data persistence. In a production environment, you would:

- Implement proper backend API
- Add authentication with JWT/sessions
- Use a real database (PostgreSQL, MongoDB, etc.)
- Add proper security measures
- Implement email notifications
- Add file upload for property images
- Add payment integration
- Implement real-time notifications

## License

MIT
