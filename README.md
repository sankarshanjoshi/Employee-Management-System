# Employee Management System Frontend

A modern employee management system built with React, featuring role-based access control, employee CRUD operations, and time tracking functionality.

## 🚀 Features

### For Administrators
- **Employee Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Employee Dashboard**: View all employees with search and filtering
- **Statistics**: Overview of total employees, payroll, and departments
- **Time Monitoring**: View all employee time logs and working hours
- **Employee Details**: Comprehensive employee information display

### For Employees
- **Time Tracking**: Clock in/out functionality with automatic hour calculations
- **Personal Dashboard**: View personal information and work history
- **Time Logs**: Track daily, weekly, and monthly working hours
- **Profile Settings**: View personal information and account settings

### Authentication & Security
- **Role-based Access Control**: Admin and Employee roles with different permissions
- **Protected Routes**: Secure navigation based on authentication status
- **Mock Authentication**: Complete login/signup flow with demo credentials

## 🛠 Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast development build tool
- **React Router Dom** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library built on Radix UI
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation library

## 🎨 UI Components

- **Cards & Tables** - Clean data presentation
- **Dialogs & Modals** - Intuitive forms and confirmations
- **Responsive Design** - Works on desktop and mobile devices
- **Modern Interface** - Clean, professional design with smooth animations

## 📊 Mock Data

The application uses comprehensive mock data including:
- 5 sample employees with different roles and departments
- Pre-configured admin and employee accounts
- Sample time logs and working hours
- Realistic employee information (names, positions, salaries, contact info)

## 🔐 Demo Credentials

### Administrator Access
- **Email**: admin@example.com
- **Password**: admin123
- **Permissions**: Full access to all features

### Employee Access
- **Email**: john.doe@example.com
- **Password**: user123
- **Permissions**: Time tracking and personal information only

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173`

4. **Login**
   Use the demo credentials provided above or create a new account

## 📱 Application Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Employee management
│   ├── layout/         # Navigation and layout
│   ├── settings/       # User settings
│   ├── timetracking/   # Time management
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (Auth)
├── lib/               # Utilities and mock API
└── main.jsx          # Application entry point
```

## 🎯 Key Features

### Employee Dashboard
- Searchable employee table
- Quick statistics overview
- Inline edit and delete actions
- Detailed employee information modal
- Add new employee dialog

### Time Tracking System
- One-click clock in/out
- Real-time hour calculations
- Daily, weekly, and monthly summaries
- Time log history with status indicators
- Admin oversight of all employee hours

### User Experience
- Responsive sidebar navigation
- Contextual actions based on user role
- Loading states and error handling
- Intuitive form validation
- Professional design with smooth transitions

## 🔧 Customization

The application is built with modularity in mind:
- Easy theme customization via Tailwind CSS
- Configurable roles and permissions
- Extensible component architecture
- Mock API ready for backend integration

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

This is a frontend-only implementation with mock data. To integrate with a real backend:

1. Replace mock API calls in `src/lib/mockApi.js`
2. Update authentication context to use real JWT tokens
3. Add proper error handling for network requests
4. Implement real-time features if needed

---

**Note**: This is a demonstration application with mock data. All employee information and credentials are fictional and for testing purposes only.