import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Pill,
  BarChart3
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "patient" | "doctor" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const getNavItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: "Dashboard", path: `/${role}` },
    ];

    if (role === "patient") {
      return [
        ...baseItems,
        { icon: Calendar, label: "Appointments", path: `/${role}/appointments` },
        { icon: FileText, label: "Medical Records", path: `/${role}/records` },
        { icon: Pill, label: "Prescriptions", path: `/${role}/prescriptions` },
      ];
    }

    if (role === "doctor") {
      return [
        ...baseItems,
        { icon: Users, label: "Patients", path: `/${role}/patients` },
        { icon: Calendar, label: "Schedule", path: `/${role}/schedule` },
        { icon: FileText, label: "Records", path: `/${role}/records` },
      ];
    }

    if (role === "admin") {
      return [
        ...baseItems,
        { icon: Users, label: "Users", path: `/${role}/users` },
        { icon: BarChart3, label: "Analytics", path: `/${role}/analytics` },
        { icon: Settings, label: "Settings", path: `/${role}/settings` },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen border-r" style={{ background: "var(--gradient-primary)" }}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Activity className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">MedRecord</h1>
                <p className="text-xs text-white/80 capitalize">{role} Portal</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
