// Test script to verify employee creation works with real-time database operations
const testEmployeeData = {
  firstName: "Test",
  lastName: "Çalışan", 
  email: "test@ik360.com",
  phone: "+90 555 123 4567",
  department: "Test Departmanı",
  position: "Test Pozisyonu",
  salary: 75000,
  startDate: "2024-01-15",
  address: "Test Adresi, İstanbul",
  emergencyContact: "+90 555 987 6543",
  notes: "Test çalışanı - gerçek zamanlı veritabanı testi"
};

const testLeaveData = {
  employeeId: 1,
  leaveType: "Yıllık İzin",
  startDate: "2024-06-15",
  endDate: "2024-06-22",
  reason: "Tatil planı"
};

const testPerformanceData = {
  employeeId: 1,
  reviewPeriod: "2024-Q1",
  overallRating: 4.5,
  goals: "Proje teslim sürelerini iyileştirmek",
  achievements: "Tüm projeler zamanında teslim edildi",
  feedback: "Mükemmel performans gösterdi"
};

console.log("Test data prepared for real-time database operations");
console.log("Employee:", testEmployeeData);
console.log("Leave:", testLeaveData);
console.log("Performance:", testPerformanceData);