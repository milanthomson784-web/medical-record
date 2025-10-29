import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, FileText, Clock, TrendingUp, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const DoctorDashboard = () => {
  const stats = [
    { title: "Today's Patients", value: "12", icon: Users, color: "text-blue-500" },
    { title: "Pending Reviews", value: "5", icon: FileText, color: "text-orange-500" },
    { title: "Appointments", value: "8", icon: Calendar, color: "text-green-500" },
    { title: "Avg Wait Time", value: "15m", icon: Clock, color: "text-purple-500" },
  ];

  const upcomingPatients = [
    { id: 1, name: "John Doe", time: "09:00 AM", reason: "Annual Checkup", status: "waiting" },
    { id: 2, name: "Jane Smith", time: "09:30 AM", reason: "Follow-up", status: "scheduled" },
    { id: 3, name: "Mike Johnson", time: "10:00 AM", reason: "Consultation", status: "scheduled" },
    { id: 4, name: "Sarah Williams", time: "10:30 AM", reason: "Lab Results", status: "scheduled" },
  ];

  const recentActivity = [
    { id: 1, action: "Updated prescription for John Doe", time: "10 mins ago" },
    { id: 2, action: "Reviewed lab results for Jane Smith", time: "1 hour ago" },
    { id: 3, action: "Scheduled follow-up with Mike Johnson", time: "2 hours ago" },
  ];

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dr. Sarah Johnson</h1>
          <p className="text-muted-foreground">Welcome to your medical dashboard</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Upcoming patient appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.reason}</p>
                    <p className="text-sm flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {patient.time}
                    </p>
                  </div>
                  <Badge variant={patient.status === "waiting" ? "default" : "secondary"}>
                    {patient.status}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-4">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Patient Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.8/5.0</div>
              <p className="text-sm text-muted-foreground mt-1">Based on 142 reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Records Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">28</div>
              <p className="text-sm text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
