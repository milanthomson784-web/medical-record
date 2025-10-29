import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import PatientRecords from "./pages/PatientRecords";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient" element={<RequireAuth allowedRoles={['patient']}><PatientDashboard /></RequireAuth>} />
            <Route path="/patient/appointments" element={<RequireAuth allowedRoles={['patient']}><PatientAppointments /></RequireAuth>} />
            <Route path="/patient/prescriptions" element={<RequireAuth allowedRoles={['patient']}><PatientPrescriptions /></RequireAuth>} />
            <Route path="/patient/records" element={<RequireAuth allowedRoles={['patient']}><PatientRecords /></RequireAuth>} />
            <Route path="/doctor" element={<RequireAuth allowedRoles={['doctor']}><DoctorDashboard /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><AdminDashboard /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
