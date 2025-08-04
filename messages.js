const chatMessages = [
  {
    id: "MSG-001",
    patientId: "PT-10045",
    sender: "Robert Johnson",
    senderType: "patient",
    content: "Hello Doctor, I've been experiencing some dizziness after taking my medication. Is this normal?",
    timestamp: "2023-05-18T14:30:00Z",
    read: true,
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "MSG-002",
    patientId: "PT-10045",
    sender: "Dr. Sarah Smith",
    senderType: "doctor",
    content: "Hi Robert, some dizziness can occur when starting this medication. Are you taking it with food?",
    timestamp: "2023-05-18T15:15:00Z",
    read: true
  },
  {
    id: "MSG-003",
    patientId: "PT-10045",
    sender: "Robert Johnson",
    senderType: "patient",
    content: "I usually take it before breakfast. Should I change that?",
    timestamp: "2023-05-18T16:45:00Z",
    read: true,
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "MSG-004",
    patientId: "PT-10046",
    sender: "Emily Davis",
    senderType: "patient",
    content: "Dr. Smith, I need a refill for my inhaler. Can you send the prescription to my pharmacy?",
    timestamp: "2023-05-12T09:20:00Z",
    read: true,
    photo: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "MSG-005",
    patientId: "PT-10046",
    sender: "Dr. Sarah Smith",
    senderType: "doctor",
    content: "Sure Emily, I've sent the prescription to CVS on Main St. How has your asthma been?",
    timestamp: "2023-05-12T11:05:00Z",
    read: true
  }
];

export default chatMessages;