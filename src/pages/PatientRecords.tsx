import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, User, Upload } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const PatientRecords = () => {
  const [records] = useState([
    { 
      id: 1, 
      title: "General Checkup Report", 
      type: "Medical Report",
      date: "2025-10-28",
      doctor: "Dr. Sarah Johnson",
      fileType: "PDF",
      size: "245 KB"
    },
    { 
      id: 2, 
      title: "Blood Test Results", 
      type: "Lab Report",
      date: "2025-10-25",
      doctor: "Dr. Michael Chen",
      fileType: "PDF",
      size: "182 KB"
    },
    { 
      id: 3, 
      title: "X-Ray - Chest", 
      type: "Imaging",
      date: "2025-10-15",
      doctor: "Dr. James Wilson",
      fileType: "DICOM",
      size: "1.2 MB"
    },
    { 
      id: 4, 
      title: "Vaccination Record", 
      type: "Immunization",
      date: "2025-09-10",
      doctor: "Dr. Sarah Johnson",
      fileType: "PDF",
      size: "98 KB"
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Medical Report":
        return "default";
      case "Lab Report":
        return "secondary";
      case "Imaging":
        return "outline";
      case "Immunization":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
            <p className="text-muted-foreground">Access your complete medical history</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Record
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Medical Records</CardTitle>
            <CardDescription>View and download your medical documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{record.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getTypeColor(record.type)}>{record.type}</Badge>
                      <Badge variant="outline">{record.fileType}</Badge>
                      <span className="text-sm text-muted-foreground">{record.size}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {record.date}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3 w-3" />
                        {record.doctor}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Quick overview of your medical information</CardDescription>
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
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-semibold">5'10"</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-lg font-semibold">165 lbs</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Last Visit</p>
                <p className="text-lg font-semibold">Oct 28, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientRecords;
