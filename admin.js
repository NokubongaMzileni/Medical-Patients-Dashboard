// Admin functionality
let users = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize users from localStorage
    users = JSON.parse(localStorage.getItem('users')) || [];

    // Load appointments and doctor bookings
    loadAppointments();
    loadUsers();
    loadDoctorBookings();
    loadDoctorOptions();

    // Add user modal
    const addUserModal = document.getElementById('addUserModal');
    const addUserBtn = document.getElementById('addUserBtn');
    const closeModal = document.querySelector('.close-modal');
    const userRoleSelect = document.getElementById('userRole');
    const idNumberField = document.getElementById('idNumberField');

    // Show/hide ID field based on role
    userRoleSelect.addEventListener('change', function() {
        idNumberField.style.display = this.value === 'patient' ? 'block' : 'none';
    });

    // Modal controls
    addUserBtn.addEventListener('click', function() {
        addUserModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        addUserModal.style.display = 'none';
    });

    // Add user form
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const role = userRoleSelect.value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const idNumber = document.getElementById('idNumber').value;
        const photoInput = document.getElementById('userPhoto');
        
        // Validate SA ID for patients
        if (role === 'patient' && !isValidSAID(idNumber)) {
            alert('Invalid South African ID number');
            return;
        }
        
        // Handle photo upload
        let photoData = null;
        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                photoData = event.target.result;
                
                // Create user with photo
                createUserWithPhoto(role, firstName, lastName, email, password, idNumber, photoData);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            // Create user without photo
            createUserWithPhoto(role, firstName, lastName, email, password, idNumber, null);
        }
    });
    
    function createUserWithPhoto(role, firstName, lastName, email, password, idNumber, photoData) {
        // Create user (simplified version)
        const newUser = {
            id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
            firstName,
            lastName,
            email,
            password,
            idNumber: role === 'patient' ? idNumber : null,
            role,
            patientId: role === 'patient' ? `PT-${Math.floor(10000 + Math.random() * 90000)}` : null,
            photo: photoData // Set photo data
        };
        
        // Add user to localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // If patient, create patient record
        if (role === 'patient') {
            // Create patient record
            const patients = JSON.parse(localStorage.getItem('patients')) || [];
            const newPatient = {
                id: newUser.patientId,
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
                photo: photoData, // Use the uploaded photo
                insurance: null
            };
            patients.push(newPatient);
            localStorage.setItem('patients', JSON.stringify(patients));
        }
        
        // Close modal and reload users
        addUserModal.style.display = 'none';
        document.getElementById('addUserForm').reset();
        loadUsers();
        alert('User created successfully!');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
        window.location.href = 'login.html';
    });
});

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const tbody = document.getElementById('appointmentsTable');
    tbody.innerHTML = '';

    appointments.forEach(appt => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--light-gray)';
        tr.innerHTML = `
            <td style="padding: 12px;">${appt.patientName}</td>
            <td style="padding: 12px;">${appt.date} at ${appt.time}</td>
            <td style="padding: 12px;">${appt.reason}</td>
            <td style="padding: 12px;">
                <span class="status-${appt.status.toLowerCase().replace(' ', '-')}">
                    ${appt.status}
                </span>
            </td>
            <td style="padding: 12px;">
                <button class="btn btn-sm" onclick="editAppointment('${appt.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appt.id}')">Cancel</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadUsers() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--light-gray)';
        tr.innerHTML = `
            <td style="padding: 12px;">${user.firstName} ${user.lastName}</td>
            <td style="padding: 12px;">${user.email}</td>
            <td style="padding: 12px;">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
            <td style="padding: 12px;">
                <button class="btn btn-sm btn-outline" onclick="editUser('${user.id}')">Edit</button>
                ${user.role !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Delete</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Admin functions
function editAppointment(id) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(a => a.id === id);
    
    if (!appointment) {
        alert('Appointment not found');
        return;
    }
    
    // Create a modal for editing
    const modalHTML = `
        <div id="editAppointmentModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Appointment</h3>
                    <span class="close-edit-modal" style="cursor: pointer;">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editAppointmentForm">
                        <div class="form-group">
                            <label for="editDate">Date</label>
                            <input type="date" id="editDate" value="${appointment.date}" required>
                        </div>
                        <div class="form-group">
                            <label for="editTime">Time</label>
                            <input type="time" id="editTime" value="${appointment.time}" required>
                        </div>
                        <div class="form-group">
                            <label for="editReason">Reason</label>
                            <input type="text" id="editReason" value="${appointment.reason}" required>
                        </div>
                        <div class="form-group">
                            <label for="editStatus">Status</label>
                            <select id="editStatus" required>
                                <option value="Scheduled" ${appointment.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                                <option value="Completed" ${appointment.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                <option value="Cancelled" ${appointment.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                <option value="No Show" ${appointment.status === 'No Show' ? 'selected' : ''}>No Show</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editNotes">Notes</label>
                            <textarea id="editNotes">${appointment.notes || ''}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Create a temporary container and add the modal
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = modalHTML;
    document.body.appendChild(tempContainer.firstElementChild);
    
    // Add event listeners
    const modal = document.getElementById('editAppointmentModal');
    const closeBtn = document.querySelector('.close-edit-modal');
    const form = document.getElementById('editAppointmentForm');
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Update appointment
        const updatedAppointment = {
            ...appointment,
            date: document.getElementById('editDate').value,
            time: document.getElementById('editTime').value,
            reason: document.getElementById('editReason').value,
            status: document.getElementById('editStatus').value,
            notes: document.getElementById('editNotes').value
        };
        
        // Update in localStorage
        const updatedAppointments = appointments.map(a => 
            a.id === id ? updatedAppointment : a
        );
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        
        // Close modal and reload
        document.body.removeChild(modal);
        loadAppointments();
    });
}

function cancelAppointment(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const updated = appointments.map(a => 
            a.id === id ? {...a, status: 'Cancelled'} : a
        );
        localStorage.setItem('appointments', JSON.stringify(updated));
        loadAppointments();
    }
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    // Create a modal for editing
    const modalHTML = `
        <div id="editUserModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit User</h3>
                    <span class="close-edit-user-modal" style="cursor: pointer;">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editUserForm">
                        <div class="form-group">
                            <label for="editFirstName">First Name</label>
                            <input type="text" id="editFirstName" value="${user.firstName}" required>
                        </div>
                        <div class="form-group">
                            <label for="editLastName">Last Name</label>
                            <input type="text" id="editLastName" value="${user.lastName}" required>
                        </div>
                        <div class="form-group">
                            <label for="editEmail">Email</label>
                            <input type="email" id="editEmail" value="${user.email}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPassword">Password (leave blank to keep current)</label>
                            <input type="password" id="editPassword">
                        </div>
                        <div class="form-group">
                            <label for="editRole">Role</label>
                            <select id="editRole" required>
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                <option value="doctor" ${user.role === 'doctor' ? 'selected' : ''}>Doctor</option>
                                <option value="patient" ${user.role === 'patient' ? 'selected' : ''}>Patient</option>
                            </select>
                        </div>
                        <div id="editIdNumberField" class="form-group" style="display: ${user.role === 'patient' ? 'block' : 'none'};">
                            <label for="editIdNumber">South African ID Number</label>
                            <input type="text" id="editIdNumber" value="${user.idNumber || ''}">
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Create a temporary container and add the modal
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = modalHTML;
    document.body.appendChild(tempContainer.firstElementChild);
    
    // Add event listeners
    const modal = document.getElementById('editUserModal');
    const closeBtn = document.querySelector('.close-edit-user-modal');
    const form = document.getElementById('editUserForm');
    const roleSelect = document.getElementById('editRole');
    const idNumberField = document.getElementById('editIdNumberField');
    
    // Show/hide ID field based on role
    roleSelect.addEventListener('change', function() {
        idNumberField.style.display = this.value === 'patient' ? 'block' : 'none';
    });
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('editFirstName').value;
        const lastName = document.getElementById('editLastName').value;
        const email = document.getElementById('editEmail').value;
        const password = document.getElementById('editPassword').value;
        const role = document.getElementById('editRole').value;
        const idNumber = document.getElementById('editIdNumber')?.value || null;
        
        // Validate ID number if patient
        if (role === 'patient' && idNumber && !isValidSAID(idNumber)) {
            alert('Please enter a valid South African ID number');
            return;
        }
        
        // Update user
        const updatedUser = {
            ...user,
            firstName,
            lastName,
            email,
            role,
            idNumber: role === 'patient' ? idNumber : null
        };
        
        // Only update password if provided
        if (password) {
            updatedUser.password = password;
        }
        
        // Update in localStorage
        const updatedUsers = users.map(u => 
            u.id === id ? updatedUser : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        users = updatedUsers;
        
        // If patient, update patient record too
        if (role === 'patient') {
            const patients = JSON.parse(localStorage.getItem('patients')) || [];
            const patientIndex = patients.findIndex(p => p.id === user.patientId);
            
            if (patientIndex !== -1) {
                patients[patientIndex] = {
                    ...patients[patientIndex],
                    firstName,
                    lastName,
                    email,
                    dob: idNumber ? getDOBFromSAID(idNumber) : patients[patientIndex].dob,
                    gender: idNumber ? getGenderFromSAID(idNumber) : patients[patientIndex].gender
                };
                localStorage.setItem('patients', JSON.stringify(patients));
            }
        }
        
        // Close modal and reload
        document.body.removeChild(modal);
        loadUsers();
    });
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const userToDelete = users.find(u => u.id === id);
        
        // Remove user from users array
        users = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        
        // If user is a patient, also remove patient record
        if (userToDelete && userToDelete.role === 'patient' && userToDelete.patientId) {
            const patients = JSON.parse(localStorage.getItem('patients')) || [];
            const updatedPatients = patients.filter(p => p.id !== userToDelete.patientId);
            localStorage.setItem('patients', JSON.stringify(updatedPatients));
        }
        
        loadUsers();
    }
}

// Helper functions
function isValidSAID(idNumber) {
    // Basic validation for South African ID
    if (!idNumber || idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
        return false;
    }
    
    // Check date validity
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));
    
    if (month < 1 || month > 12) {
        return false;
    }
    
    if (day < 1 || day > 31) {
        return false;
    }
    
    // Check citizenship digit
    const citizenshipDigit = parseInt(idNumber.charAt(10));
    if (citizenshipDigit !== 0 && citizenshipDigit !== 1) {
        return false;
    }
    
    // Check checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(idNumber.charAt(i));
        if (i % 2 === 0) {
            sum += digit;
        } else {
            sum += digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
        }
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(idNumber.charAt(12));
}

function getDOBFromSAID(idNumber) {
    if (!idNumber || idNumber.length !== 13) {
        return 'Unknown';
    }
    
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));
    
    // Determine century
    const currentYear = new Date().getFullYear();
    const century = year > (currentYear % 100) ? 1900 : 2000;
    const fullYear = century + year;
    
    // Format date
    return `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function getGenderFromSAID(idNumber) {
    if (!idNumber || idNumber.length !== 13) {
        return 'Unknown';
    }
    
    // Gender digit is the 7th digit (index 6)
    // 0-4 = Female, 5-9 = Male
    const genderDigit = parseInt(idNumber.charAt(6));
    return genderDigit < 5 ? 'Female' : 'Male';
}

// Doctor booking functions
function loadDoctorOptions() {
    const doctorFilter = document.getElementById('doctorFilter');
    const doctors = users.filter(user => user.role === 'doctor');
    
    // Clear existing options except the first one
    while (doctorFilter.options.length > 1) {
        doctorFilter.remove(1);
    }
    
    // Add doctor options
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `Dr. ${doctor.firstName} ${doctor.lastName}`;
        doctorFilter.appendChild(option);
    });
    
    // Add event listener for filter change
    doctorFilter.addEventListener('change', filterDoctorBookings);
    
    // Add event listener for search
    document.getElementById('doctorBookingSearch').addEventListener('input', filterDoctorBookings);
}

function loadDoctorBookings() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const tbody = document.getElementById('doctorBookingsTable');
    tbody.innerHTML = '';
    
    appointments.forEach(appt => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--light-gray)';
        tr.innerHTML = `
            <td style="padding: 12px;">${appt.doctor || 'Not Assigned'}</td>
            <td style="padding: 12px;">${appt.patientName}</td>
            <td style="padding: 12px;">${appt.date} at ${appt.time}</td>
            <td style="padding: 12px;">${appt.reason}</td>
            <td style="padding: 12px;">
                <span class="status-${appt.status.toLowerCase().replace(' ', '-')}">
                    ${appt.status}
                </span>
            </td>
            <td style="padding: 12px;">
                <button class="btn btn-sm" onclick="viewDoctorBookingDetails('${appt.id}')">View</button>
                <button class="btn btn-sm" onclick="editAppointment('${appt.id}')">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterDoctorBookings() {
    const doctorId = document.getElementById('doctorFilter').value;
    const searchTerm = document.getElementById('doctorBookingSearch').value.toLowerCase();
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const tbody = document.getElementById('doctorBookingsTable');
    tbody.innerHTML = '';
    
    // Filter appointments by doctor and search term
    const filteredAppointments = appointments.filter(appt => {
        const matchesDoctor = !doctorId || getDoctorIdFromName(appt.doctor) === doctorId;
        const matchesSearch = !searchTerm || 
            appt.patientName.toLowerCase().includes(searchTerm) || 
            appt.reason.toLowerCase().includes(searchTerm) || 
            appt.status.toLowerCase().includes(searchTerm) || 
            appt.doctor?.toLowerCase().includes(searchTerm);
        
        return matchesDoctor && matchesSearch;
    });
    
    // Display filtered appointments
    filteredAppointments.forEach(appt => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--light-gray)';
        tr.innerHTML = `
            <td style="padding: 12px;">${appt.doctor || 'Not Assigned'}</td>
            <td style="padding: 12px;">${appt.patientName}</td>
            <td style="padding: 12px;">${appt.date} at ${appt.time}</td>
            <td style="padding: 12px;">${appt.reason}</td>
            <td style="padding: 12px;">
                <span class="status-${appt.status.toLowerCase().replace(' ', '-')}">
                    ${appt.status}
                </span>
            </td>
            <td style="padding: 12px;">
                <button class="btn btn-sm" onclick="viewDoctorBookingDetails('${appt.id}')">View</button>
                <button class="btn btn-sm" onclick="editAppointment('${appt.id}')">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getDoctorIdFromName(doctorName) {
    if (!doctorName) return null;
    
    // Extract doctor's name without the 'Dr.' prefix
    const name = doctorName.replace('Dr. ', '');
    const [firstName, lastName] = name.split(' ');
    
    // Find the doctor in users
    const doctor = users.find(user => 
        user.role === 'doctor' && 
        user.firstName === firstName && 
        user.lastName === lastName
    );
    
    return doctor ? doctor.id : null;
}

function viewDoctorBookingDetails(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        alert('Appointment not found');
        return;
    }
    
    // Create a modal for viewing details
    const modalHTML = `
        <div id="viewBookingModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Booking Details</h3>
                    <span class="close-view-modal" style="cursor: pointer;">&times;</span>
                </div>
                <div class="modal-body">
                    <div style="display: flex; margin-bottom: 20px;">
                        <div style="flex: 1;">
                            <h4>Appointment Information</h4>
                            <p><strong>ID:</strong> ${appointment.id}</p>
                            <p><strong>Date:</strong> ${appointment.date}</p>
                            <p><strong>Time:</strong> ${appointment.time}</p>
                            <p><strong>Reason:</strong> ${appointment.reason}</p>
                            <p><strong>Status:</strong> ${appointment.status}</p>
                            <p><strong>Notes:</strong> ${appointment.notes || 'None'}</p>
                        </div>
                        <div style="flex: 1;">
                            <h4>Doctor Information</h4>
                            <p><strong>Doctor:</strong> ${appointment.doctor || 'Not Assigned'}</p>
                            <h4>Patient Information</h4>
                            <p><strong>Name:</strong> ${appointment.patientName}</p>
                            <p><strong>ID:</strong> ${appointment.patientId}</p>
                        </div>
                    </div>
                    <button class="btn" onclick="editAppointment('${appointment.id}')">Edit Appointment</button>
                </div>
            </div>
        </div>
    `;
    
    // Create a temporary container and add the modal
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = modalHTML;
    document.body.appendChild(tempContainer.firstElementChild);
    
    // Add event listener for close button
    const modal = document.getElementById('viewBookingModal');
    const closeBtn = document.querySelector('.close-view-modal');
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}