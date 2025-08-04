const patients = [
  {
    id: "PT-10045",
    firstName: "Robert",
    lastName: "Johnson",
    dob: "1985-07-12",
    gender: "Male",
    email: "robert.johnson@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    bloodType: "A+",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    medications: ["Metformin", "Lisinopril"],
    lastVisit: "2023-05-15",
    nextAppointment: "2023-06-20",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    insurance: {
      provider: "Blue Cross",
      policyNumber: "BCBS12345678",
      expiry: "2024-12-31"
    }
  },
  {
    id: "PT-10046",
    firstName: "Emily",
    lastName: "Davis",
    dob: "1989-03-24",
    gender: "Female",
    email: "emily.davis@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Somewhere, USA",
    bloodType: "O-",
    allergies: ["Latex"],
    conditions: ["Asthma", "Migraines"],
    medications: ["Albuterol", "Sumatriptan"],
    lastVisit: "2023-05-10",
    nextAppointment: "2023-06-15",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    insurance: {
      provider: "Aetna",
      policyNumber: "AETNA87654321",
      expiry: "2023-12-31"
    }
  },
  {
    id: "PT-10047",
    firstName: "Michael",
    lastName: "Brown",
    dob: "1978-11-05",
    gender: "Male",
    email: "michael.brown@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine Rd, Nowhere, USA",
    bloodType: "B+",
    allergies: ["Peanuts"],
    conditions: ["High Cholesterol", "GERD"],
    medications: ["Atorvastatin", "Omeprazole"],
    lastVisit: "2023-04-28",
    nextAppointment: "2023-06-10",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    insurance: {
      provider: "United Healthcare",
      policyNumber: "UHG56781234",
      expiry: "2023-09-30"
    }
  },
  {
    id: "PT-10048",
    firstName: "Jennifer",
    lastName: "Wilson",
    dob: "1992-02-18",
    gender: "Female",
    email: "jennifer.wilson@example.com",
    phone: "(555) 456-7890",
    address: "321 Elm St, Anywhere, USA",
    bloodType: "AB+",
    allergies: ["Iodine"],
    conditions: ["Depression", "Anxiety"],
    medications: ["Sertraline", "Lorazepam"],
    lastVisit: "2023-05-05",
    nextAppointment: "2023-06-08",
    photo: "https://randomuser.me/api/portraits/women/42.jpg",
    insurance: {
      provider: "Cigna",
      policyNumber: "CIGNA43218765",
      expiry: "2024-06-30"
    }
  },
  {
    id: "PT-10049",
    firstName: "David",
    lastName: "Miller",
    dob: "1965-09-30",
    gender: "Male",
    email: "david.miller@example.com",
    phone: "(555) 567-8901",
    address: "654 Maple Dr, Elsewhere, USA",
    bloodType: "A-",
    allergies: ["Sulfa Drugs"],
    conditions: ["Arthritis", "Osteoporosis"],
    medications: ["Celecoxib", "Alendronate"],
    lastVisit: "2023-04-20",
    nextAppointment: "2023-06-05",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
    insurance: {
      provider: "Medicare",
      policyNumber: "MCARE98765432",
      expiry: "2023-12-31"
    }
  }
];

export default patients;