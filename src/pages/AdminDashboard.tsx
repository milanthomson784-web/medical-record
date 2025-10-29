import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, DollarSign, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getDashboardStats, getAppointmentsByWeek, getRevenueByMonth, getAuditLogs } from "@/services/analyticsService";
import { AuditLog } from "@/types/database";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalRevenue: 0,
  });
  const [appointmentData, setAppointmentData] = useState<Array<{ date: string; count: number }>>([]);
  const [revenueData, setRevenueData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, appointmentsData, revenueData, logsData] = await Promise.all([
          getDashboardStats(),
          getAppointmentsByWeek(),
          getRevenueByMonth(6),
          getAuditLogs(10),
        ]);

        setStats(statsData);
        setAppointmentData(appointmentsData);
        setRevenueData(revenueData);
        setAuditLogs(logsData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statsDisplay = [
    { title: "Total Patients", value: stats.totalPatients.toString(), icon: Users, color: "text-blue-500" },
    { title: "Total Appointments", value: stats.totalAppointments.toString(), icon: Calendar, color: "text-purple-500" },
    { title: "Upcoming Appointments", value: stats.upcomingAppointments.toString(), icon: UserCog, color: "text-green-500" },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-orange-500" },
  ];

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground">Monitor and manage your healthcare system</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsDisplay.map((stat) => (
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
              <CardTitle>Revenue by Month</CardTitle>
              <CardDescription>Revenue trends over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Appointments</CardTitle>
              <CardDescription>Appointments over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
              <CardDescription>Latest system activities and changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No audit logs available
                </p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">
                        Table: {log.table_name} {log.record_id && `(${log.record_id.slice(0, 8)}...)`}
                      </p>
                      {log.ip_address && (
                        <p className="text-xs text-muted-foreground">IP: {log.ip_address}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
