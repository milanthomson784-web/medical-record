import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, User, Calendar, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const PatientPrescriptions = () => {
  const [prescriptions] = useState([
    { 
      id: 1, 
      medication: "Amoxicillin 500mg", 
      dosage: "3 times daily", 
      duration: "7 days", 
      doctor: "Dr. Sarah Johnson",
      date: "2025-10-28",
      status: "active",
      instructions: "Take with food"
    },
    { 
      id: 2, 
      medication: "Ibuprofen 200mg", 
      dosage: "As needed (max 4 times daily)", 
      duration: "Ongoing", 
      doctor: "Dr. Michael Chen",
      date: "2025-10-15",
      status: "active",
      instructions: "For pain relief"
    },
    { 
      id: 3, 
      medication: "Lisinopril 10mg", 
      dosage: "Once daily", 
      duration: "90 days", 
      doctor: "Dr. Sarah Johnson",
      date: "2025-09-20",
      status: "active",
      instructions: "Take in the morning"
    },
    { 
      id: 4, 
      medication: "Azithromycin 250mg", 
      dosage: "Once daily", 
      duration: "5 days", 
      doctor: "Dr. Emily Martinez",
      date: "2025-08-10",
      status: "completed",
      instructions: "Take on empty stomach"
    },
  ]);

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">Manage your medications and prescriptions</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>Current medications you are taking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.filter(rx => rx.status === "active").map((rx) => (
                <div key={rx.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{rx.medication}</h3>
                      </div>
                      <Badge variant="default" className="mt-1">{rx.status}</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Dosage</p>
                      <p className="font-medium">{rx.dosage}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{rx.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Instructions</p>
                      <p className="font-medium">{rx.instructions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Prescribed Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {rx.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Prescribed by: {rx.doctor}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Prescriptions</CardTitle>
              <CardDescription>Previously completed medications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.filter(rx => rx.status === "completed").map((rx) => (
                <div key={rx.id} className="border rounded-lg p-4 space-y-3 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">{rx.medication}</h3>
                      </div>
                      <Badge variant="secondary" className="mt-1">{rx.status}</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Dosage</p>
                      <p className="font-medium">{rx.dosage}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{rx.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Prescribed by: {rx.doctor}</p>
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

export default PatientPrescriptions;
