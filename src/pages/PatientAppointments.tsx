import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const PatientAppointments = () => {
  const [appointments] = useState([
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "General Practitioner", date: "2025-11-05", time: "10:00 AM", type: "General Checkup", status: "upcoming" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Cardiologist", date: "2025-11-08", time: "2:30 PM", type: "Follow-up", status: "upcoming" },
    { id: 3, doctor: "Dr. Emily Martinez", specialty: "Dermatologist", date: "2025-10-28", time: "2:30 PM", type: "Consultation", status: "completed" },
    { id: 4, doctor: "Dr. James Wilson", specialty: "Orthopedic", date: "2025-10-15", time: "11:00 AM", type: "X-Ray Review", status: "completed" },
  ]);

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">Manage your medical appointments</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.filter(apt => apt.status === "upcoming").map((apt) => (
                <div key={apt.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{apt.doctor}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                    <div className="flex items-center gap-4">
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {apt.date}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {apt.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="default">{apt.status}</Badge>
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button variant="ghost" size="sm">Cancel</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Your appointment history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.filter(apt => apt.status === "completed").map((apt) => (
                <div key={apt.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{apt.doctor}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                    <div className="flex items-center gap-4">
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {apt.date}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {apt.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary">{apt.status}</Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientAppointments;
