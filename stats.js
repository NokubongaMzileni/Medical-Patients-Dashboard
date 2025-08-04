const dashboardStats = {
  today: {
    totalAppointments: 24,
    completed: 14,
    pending: 8,
    cancelled: 2,
    averageWaitTime: "15 minutes"
  },
  weekly: {
    appointments: [
      { day: "Monday", completed: 18, noShow: 2, cancelled: 3 },
      { day: "Tuesday", completed: 22, noShow: 1, cancelled: 2 },
      { day: "Wednesday", completed: 19, noShow: 3, cancelled: 1 },
      { day: "Thursday", completed: 24, noShow: 2, cancelled: 2 },
      { day: "Friday", completed: 20, noShow: 1, cancelled: 3 },
      { day: "Saturday", completed: 8, noShow: 0, cancelled: 1 }
    ],
    patientDemographics: {
      ageGroups: [
        { range: "0-18", count: 15 },
        { range: "19-35", count: 35 },
        { range: "36-50", count: 25 },
        { range: "51-65", count: 15 },
        { range: "65+", count: 10 }
      ],
      genderDistribution: {
        male: 45,
        female: 55
      },
      commonConditions: [
        "Hypertension",
        "Diabetes",
        "High Cholesterol",
        "Asthma",
        "Depression"
      ]
    }
  }
};

export default dashboardStats;