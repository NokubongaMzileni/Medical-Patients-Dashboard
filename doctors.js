const doctors = [
  {
    id: "DR-001",
    firstName: "Sarah",
    lastName: "Smith",
    specialty: "Internal Medicine",
    email: "dr.smith@medcare.com",
    phone: "(555) 987-6543",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    schedule: {
      monday: { start: "8:00 AM", end: "5:00 PM" },
      tuesday: { start: "8:00 AM", end: "5:00 PM" },
      wednesday: { start: "9:00 AM", end: "6:00 PM" },
      thursday: { start: "8:00 AM", end: "5:00 PM" },
      friday: { start: "8:00 AM", end: "3:00 PM" }
    }
  },
  {
    id: "DR-002",
    firstName: "James",
    lastName: "Wilson",
    specialty: "Cardiology",
    email: "dr.wilson@medcare.com",
    phone: "(555) 876-5432",
    photo: "https://randomuser.me/api/portraits/men/41.jpg",
    schedule: {
      monday: { start: "9:00 AM", end: "4:00 PM" },
      tuesday: { start: "9:00 AM", end: "4:00 PM" },
      wednesday: { start: "10:00 AM", end: "6:00 PM" },
      friday: { start: "8:00 AM", end: "3:00 PM" }
    }
  }
];

export default doctors;