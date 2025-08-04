const medicalRecords = [
  {
    id: "REC-10045-001",
    patientId: "PT-10045",
    date: "2023-05-15",
    type: "Consultation",
    doctor: "Dr. Sarah Smith",
    diagnosis: "Type 2 Diabetes, Hypertension",
    treatment: "Adjusted medication dosage",
    notes: "Patient reports better glucose control. BP slightly elevated.",
    prescriptions: [
      {
        id: "RX-10045-001",
        medication: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        refills: 3,
        expiry: "2023-08-15"
      }
    ],
    labResults: [
      {
        test: "HbA1c",
        result: "7.2%",
        normalRange: "4.0-5.6%",
        status: "High"
      }
    ]
  },
  {
    id: "REC-10046-001",
    patientId: "PT-10046",
    date: "2023-05-10",
    type: "Annual Checkup",
    doctor: "Dr. Sarah Smith",
    diagnosis: "Asthma, Migraines",
    treatment: "Preventative care",
    notes: "Asthma well controlled. Migraine frequency reduced.",
    prescriptions: [
      {
        id: "RX-10046-001",
        medication: "Albuterol Inhaler",
        dosage: "90mcg",
        frequency: "As needed",
        refills: 2,
        expiry: "2023-11-10"
      }
    ],
    labResults: [
      {
        test: "CBC",
        result: "Normal",
        normalRange: "",
        status: "Normal"
      }
    ]
  }
];

export default medicalRecords;