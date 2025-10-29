import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Pill, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getPatientByProfileId } from "@/services/patientService";
import { getAppointmentsByPatient } from "@/services/appointmentService";
import { getActivePrescriptionsByPatient } from "@/services/prescriptionService";
import { getMedicalRecordsByPatient } from "@/services/medicalRecordService";
import { Patient, Appointment, Prescription, MedicalRecord } from "@/types/database";
import { useNavigate } from "react-router-dom";
import { decryptField } from "@/lib/encryption";

const PatientDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [recordCount, setRecordCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!profile) return;

      try {
        const patientData = await getPatientByProfileId(profile.id);
        if (!patientData) {
          setLoading(false);
          return;
        }

        setPatient(patientData);

        const [appts, rxs, records] = await Promise.all([
          getAppointmentsByPatient(patientData.id),
          getActivePrescriptionsByPatient(patientData.id),
          getMedicalRecordsByPatient(patientData.id),
        ]);

        const upcomingAppts = appts.filter(
          apt => apt.status === 'scheduled' || apt.status === 'confirmed'
        );
        setAppointments(upcomingAppts.slice(0, 3));
        setPrescriptions(rxs.slice(0, 3));
        setRecordCount(records.length);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [profile]);

  const lastVisit = appointments.find(apt => apt.status === 'completed');
  const lastVisitDate = lastVisit
    ? new Date(lastVisit.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'N/A';

  const stats = [
    { title: "Upcoming Appointments", value: appointments.length.toString(), icon: Calendar, color: "text-blue-500" },
    { title: "Active Prescriptions", value: prescriptions.length.toString(), icon: Pill, color: "text-green-500" },
    { title: "Medical Records", value: recordCount.toString(), icon: FileText, color: "text-purple-500" },
    { title: "Last Visit", value: lastVisitDate, icon: Clock, color: "text-orange-500" },
  ];

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.first_name}
          </h1>
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
              {appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming appointments
                </p>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">
                        Dr. {apt.doctor?.profile?.first_name} {apt.doctor?.profile?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{apt.appointment_type}</p>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(apt.appointment_date).toLocaleDateString()} at {apt.start_time}
                      </p>
                    </div>
                    <Badge variant={apt.status === "scheduled" || apt.status === "confirmed" ? "default" : "secondary"}>
                      {apt.status}
                    </Badge>
                  </div>
                ))
              )}
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={() => navigate('/patient/appointments')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>Current medications and dosage information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No active prescriptions
                </p>
              ) : (
                prescriptions.map((rx) => (
                  <div key={rx.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">Prescription</p>
                      <Pill className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Duration: {rx.duration}</p>
                      <p>Prescribed by: Dr. {rx.doctor?.profile?.first_name} {rx.doctor?.profile?.last_name}</p>
                      <p className="text-xs">Prescribed: {new Date(rx.prescribed_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={() => navigate('/patient/prescriptions')}
              >
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
                <p className="text-lg font-semibold">{patient?.blood_group || 'Not specified'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="text-lg font-semibold">
                  {patient?.allergies && patient.allergies.length > 0
                    ? patient.allergies.join(', ')
                    : 'None recorded'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Chronic Conditions</p>
                <p className="text-lg font-semibold">
                  {patient?.chronic_conditions && patient.chronic_conditions.length > 0
                    ? patient.chronic_conditions.join(', ')
                    : 'None recorded'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
