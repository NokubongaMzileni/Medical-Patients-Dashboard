// Settings page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize form with current user data
    loadUserData();
    
    // Setup event listeners
    setupEventListeners();
});

function loadUserData() {
    // Populate form fields with current user data
    document.getElementById('firstName').value = currentUser.firstName || '';
    document.getElementById('lastName').value = currentUser.lastName || '';
    document.getElementById('email').value = currentUser.email || '';
    
    // Show ID field for patients only
    if (currentUser.role === 'patient') {
        document.getElementById('idNumberField').style.display = 'block';
        document.getElementById('idNumber').value = currentUser.idNumber || '';
    }
    
    // Load profile picture if exists
    updateProfilePicture();
}

function updateProfilePicture() {
    const profilePicture = document.getElementById('profile-picture');
    const headerProfileImage = document.getElementById('header-profile-image');
    
    // Clear existing content
    profilePicture.innerHTML = '';
    headerProfileImage.innerHTML = '';
    
    if (currentUser.photo) {
        // Create and add image to profile picture container
        const img = document.createElement('img');
        img.src = currentUser.photo;
        img.alt = 'Profile Picture';
        profilePicture.appendChild(img);
        
        // Update header profile image
        const headerImg = document.createElement('img');
        headerImg.src = currentUser.photo;
        headerImg.alt = 'User';
        headerProfileImage.appendChild(headerImg);
    } else {
        // Show default icon if no photo
        const icon = document.createElement('i');
        icon.className = 'fas fa-user';
        profilePicture.appendChild(icon);
        
        // Update header with default icon
        const headerIcon = document.createElement('i');
        headerIcon.className = 'fas fa-user-circle';
        headerIcon.style.fontSize = '1.8rem';
        headerIcon.style.color = 'var(--primary)';
        headerProfileImage.appendChild(headerIcon);
    }
}

function setupEventListeners() {
    // Upload photo button
    document.getElementById('uploadPhotoBtn').addEventListener('click', function() {
        document.getElementById('photoInput').click();
    });
    
    // Photo input change
    document.getElementById('photoInput').addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const photoData = event.target.result;
                updateUserPhoto(photoData);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Remove photo button
    document.getElementById('removePhotoBtn').addEventListener('click', function() {
        updateUserPhoto(null);
    });
    
    // Settings form submission
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveUserSettings();
    });
}

function updateUserPhoto(photoData) {
    // Update current user object
    currentUser.photo = photoData;
    
    // Update in localStorage
    updateUserInStorage();
    
    // Update UI
    updateProfilePicture();
    
    // Show success message
    showSuccessMessage('Profile picture updated successfully');
}

function saveUserSettings() {
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const idNumber = currentUser.role === 'patient' ? document.getElementById('idNumber').value : null;
    
    // Validate email is not already taken by another user
    if (email !== currentUser.email) {
        const emailExists = users.some(user => user.id !== currentUser.id && user.email === email);
        if (emailExists) {
            showSuccessMessage('Email already in use by another account', true);
            return;
        }
    }
    
    // Validate ID number if changed and user is a patient
    if (currentUser.role === 'patient' && idNumber && idNumber !== currentUser.idNumber) {
        if (!isValidSAID(idNumber)) {
            showSuccessMessage('Invalid South African ID number', true);
            return;
        }
        
        const idExists = users.some(user => user.id !== currentUser.id && user.idNumber === idNumber);
        if (idExists) {
            showSuccessMessage('ID number already registered', true);
            return;
        }
    }
    
    // Update user object
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.email = email;
    
    // Only update password if provided
    if (password) {
        currentUser.password = password;
    }
    
    // Update ID number if provided and user is a patient
    if (currentUser.role === 'patient' && idNumber) {
        currentUser.idNumber = idNumber;
        
        // Update patient record if ID changed
        if (idNumber !== currentUser.idNumber) {
            updatePatientRecord(idNumber);
        }
    }
    
    // Update in localStorage
    updateUserInStorage();
    
    // Show success message
    showSuccessMessage('Settings saved successfully');
}

function updateUserInStorage() {
    // Update users array
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update current user in session
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function updatePatientRecord(idNumber) {
    // Only for patient users
    if (currentUser.role !== 'patient' || !currentUser.patientId) return;
    
    // Get patients data
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patientIndex = patients.findIndex(p => p.id === currentUser.patientId);
    
    if (patientIndex !== -1) {
        // Update patient record
        patients[patientIndex].firstName = currentUser.firstName;
        patients[patientIndex].lastName = currentUser.lastName;
        patients[patientIndex].email = currentUser.email;
        patients[patientIndex].dob = getDOBFromSAID(idNumber);
        patients[patientIndex].gender = getGenderFromSAID(idNumber);
        patients[patientIndex].photo = currentUser.photo;
        
        // Save back to localStorage
        localStorage.setItem('patients', JSON.stringify(patients));
    }
}

function showSuccessMessage(message, isError = false) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    if (isError) {
        successMessage.style.color = 'var(--danger)';
    } else {
        successMessage.style.color = 'var(--secondary)';
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}