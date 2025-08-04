// User data structure
let users = JSON.parse(localStorage.getItem('users')) || [
  {
    id: 'USR-001',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@medcare.com',
    password: 'admin123', // In a real app, this should be hashed
    idNumber: '8001010001082', // Sample SA ID
    role: 'admin',
    patientId: null
  },
  {
    id: 'USR-002',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@medcare.com',
    password: 'doctor123',
    idNumber: null,
    role: 'doctor',
    patientId: null
  },
  {
    id: 'USR-003',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@medcare.com',
    password: 'doctor123',
    idNumber: null,
    role: 'doctor',
    patientId: null
  }
];

// Current user session
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize localStorage if it doesn't exist
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Register new patient
function registerPatient(firstName, lastName, email, password, idNumber, photoData = null) {
  // Validate South African ID (simple version)
  if (!isValidSAID(idNumber)) {
    return { success: false, message: 'Invalid South African ID number' };
  }

  // Check if email already exists
  if (users.some(user => user.email === email)) {
    return { success: false, message: 'Email already registered' };
  }

  // Check if ID already exists
  if (users.some(user => user.idNumber === idNumber)) {
    return { success: false, message: 'ID number already registered' };
  }

  // Create new patient in patients data
  const newPatientId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
  const newPatient = {
    id: newPatientId,
    firstName,
    lastName,
    dob: getDOBFromSAID(idNumber),
    gender: getGenderFromSAID(idNumber),
    email,
    phone: '',
    address: '',
    bloodType: '',
    allergies: [],
    conditions: [],
    medications: [],
    lastVisit: null,
    nextAppointment: null,
    photo: photoData || null, // Use uploaded photo or null
    insurance: null
  };

  // Add to users
  const newUser = {
    id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName,
    lastName,
    email,
    password, // In real app, hash this password
    idNumber,
    role: 'patient',
    patientId: newPatientId,
    photo: photoData || null // Store photo in user object as well
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Add to patients data
  const patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.push(newPatient);
  localStorage.setItem('patients', JSON.stringify(patients));

  return { success: true, message: 'Registration successful' };
}

// Login function
function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password' };
}

// Logout function
function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
}

// Helper functions for South African ID
function isValidSAID(id) {
  // Basic validation - should be 13 digits
  return /^\d{13}$/.test(id);
}

function getDOBFromSAID(id) {
  // Extract date parts from SA ID (YYMMDD format)
  const yy = id.substring(0, 2);
  const mm = id.substring(2, 4);
  const dd = id.substring(4, 6);
  const century = parseInt(yy) < 22 ? '20' : '19'; // Simple century determination
  return `${century}${yy}-${mm}-${dd}`;
}

function getGenderFromSAID(id) {
  // Gender is determined by the 7th-10th digits (0000-4999 = female, 5000-9999 = male)
  const genderDigits = parseInt(id.substring(6, 10));
  return genderDigits < 5000 ? 'Female' : 'Male';
}

// Initialize appointments if they don't exist
if (!localStorage.getItem('appointments')) {
  const initialAppointments = [
    {
      id: 'APT-001',
      patientId: 'PT-10001',
      patientName: 'John Doe',
      date: '2023-06-15',
      time: '09:00 AM',
      reason: 'Annual checkup',
      status: 'Scheduled',
      doctor: 'Dr. Sarah Smith',
      notes: ''
    },
    {
      id: 'APT-002',
      patientId: 'PT-10002',
      patientName: 'Jane Smith',
      date: '2023-06-15',
      time: '10:30 AM',
      reason: 'Follow-up',
      status: 'Completed',
      doctor: 'Dr. James Wilson',
      notes: 'Patient reported improvement'
    },
    {
      id: 'APT-003',
      patientId: 'PT-10003',
      patientName: 'Michael Johnson',
      date: '2023-06-16',
      time: '11:00 AM',
      reason: 'Consultation',
      status: 'Scheduled',
      doctor: 'Dr. Sarah Smith',
      notes: ''
    }
  ];
  localStorage.setItem('appointments', JSON.stringify(initialAppointments));
}

// No need for export in browser environment
// These functions are globally available