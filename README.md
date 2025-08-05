# Medical Patients Dashboard

## Overview

A comprehensive medical patient management system designed for healthcare providers to efficiently manage patient appointments, medical records, and communications. This web application features:

- Patient registration with South African ID validation
- Role-based authentication (Patient, Doctor, Admin)
- Appointment scheduling and management
- Medical records tracking
- Secure messaging system
- Admin dashboard for user management

## Features

### Authentication System
- Patient registration with name, email, password, and South African ID
- Secure login/logout functionality
- Role-based access control
- Session management

### Patient Dashboard
- View upcoming appointments
- Access medical records
- View vital signs trends
- Secure messaging with healthcare providers

### Admin Dashboard
- Manage all appointments (view, edit, cancel)
- User management (create, edit, delete accounts)
- View system statistics

### South African ID Integration
- Automatic extraction of date of birth and gender
- Validation of ID number format
- Integration with patient profiles

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Local Storage**: For data persistence (simulating backend in this demo)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NokubongaMzileni/medical-patients-dashboard.git
   ```

2. Navigate to the project directory:
   ```bash
   cd medical-patients-dashboard
   ```

3. Open the application in your browser:
   - Simply open `index.html` in your preferred browser
   - For full functionality, consider using a local server (e.g., VS Code Live Server)

## Usage

1. **Registration**:
   - Navigate to `/register.html`
   - Fill in your details including a valid South African ID number
   - Submit the form to create your account

2. **Login**:
   - Go to `/login.html`
   - Enter your credentials
   - You'll be redirected to the appropriate dashboard based on your role

3. **Admin Access**:
   - Use the default admin account:
     - Email: `admin@medcare.com`
     - Password: `admin123`

4. **Navigation**:
   - Use the sidebar to access different sections
   - Patients can view their appointments and records
   - Admins can manage all system users and appointments

## File Structure

```
medical-dashboard/
├── index.html          # Dashboard home
├── login.html          # Login page
├── register.html       # Patient registration
├── admin.html          # Admin dashboard
├── patients.html       # Patients management
├── appointments.html   # Appointments calendar
├── records.html        # Medical records
├── chat.html           # Messaging interface
├── css/
│   └── style.css       # Shared styles
├── js/
│   ├── script.js       # Shared JavaScript
│   ├── auth.js         # Authentication logic
│   └── admin.js        # Admin-specific functions
├── data/
│   ├── patients.js     # Patient data
│   ├── appointments.js # Appointment data
│   ├── records.js      # Medical records
│   ├── vitals.js       # Vital signs data
│   ├── messages.js     # Chat messages
│   ├── doctors.js      # Doctor information
│   ├── stats.js        # Dashboard statistics
│   └── users.js        # User accounts
└── README.md           # This file
```


## Author
Nokubonga Mzileni
