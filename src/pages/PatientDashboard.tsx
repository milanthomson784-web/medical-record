import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, FileText, Pill, Clock, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const PatientDashboard = () => {
  const [appointments] = useState([
    { id: 1, doctor: "Dr. Sarah Johnson", date: "2025-11-05", time: "10:00 AM", type: "General Checkup", status: "upcoming" },
    { id: 2, doctor: "Dr. Michael Chen", date: "2025-10-28", time: "2:30 PM", type: "Follow-up", status: "completed" },
  ]);

  const [prescriptions] = useState([
    { id: 1, medication: "Amoxicillin 500mg", dosage: "3x daily", duration: "7 days", doctor: "Dr. Sarah Johnson" },
    { id: 2, medication: "Ibuprofen 200mg", dosage: "As needed", duration: "Ongoing", doctor: "Dr. Michael Chen" },
  ]);

  const stats = [
    { title: "Upcoming Appointments", value: "2", icon: Calendar, color: "text-blue-500" },
    { title: "Active Prescriptions", value: "3", icon: Pill, color: "text-green-500" },
    { title: "Medical Records", value: "12", icon: FileText, color: "text-purple-500" },
    { title: "Last Visit", value: "Oct 28", icon: Clock, color: "text-orange-500" },
  ];

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's an overview of your health information</p>
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
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled medical appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{apt.doctor}</p>
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {apt.date} at {apt.time}
                    </p>
                  </div>
                  <Badge variant={apt.status === "upcoming" ? "default" : "secondary"}>
                    {apt.status}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>Current medications and dosage information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{rx.medication}</p>
                    <Pill className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Dosage: {rx.dosage}</p>
                    <p>Duration: {rx.duration}</p>
                    <p>Prescribed by: {rx.doctor}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View All Prescriptions
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Quick overview of your vital information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="text-lg font-semibold">O+</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="text-lg font-semibold">Penicillin</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p className="text-lg font-semibold">+1 234-567-8900</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
