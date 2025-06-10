import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LEAVE_TYPES } from "@/lib/constants";

export function LeaveCalendar() {
  const { data: leaves, isLoading } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  if (isLoading) {
    return (
      <Card className="hr-stat-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">İzin Takvimi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const approvedLeaves = leaves?.filter((leave: any) => leave.status === "approved") || [];
  const upcomingLeaves = approvedLeaves
    .map((leave: any) => {
      const employee = employees?.find((emp: any) => emp.id === leave.employeeId);
      const leaveType = LEAVE_TYPES.find(type => type.value === leave.leaveType);
      
      return {
        ...leave,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : "Unknown",
        employeeImage: employee?.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
        leaveTypeLabel: leaveType?.label || leave.leaveType,
        dateRange: `${new Date(leave.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - ${new Date(leave.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}`,
        duration: `${leave.days} gün`
      };
    })
    .slice(0, 3);

  return (
    <Card className="hr-stat-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">İzin Takvimi</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            Tümünü Gör
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingLeaves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Yaklaşan onaylanmış izin bulunmuyor</p>
            </div>
          ) : (
            upcomingLeaves.map((leave: any) => (
              <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={leave.employeeImage} 
                    alt="Employee" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{leave.employeeName}</p>
                    <p className="text-sm text-gray-600">{leave.leaveTypeLabel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{leave.dateRange}</p>
                  <p className="text-xs text-gray-500">{leave.duration}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
