import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, Calendar, FileText, BarChart3, Users, Brain, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Secure & HIPAA Compliant",
      description: "Enterprise-grade security with end-to-end encryption for all medical data",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Intelligent appointment booking system with automated reminders",
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Complete electronic health records with easy access and sharing",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting for better decision making",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Tailored interfaces for patients, doctors, and administrators",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Smart health predictions and automated medical report analysis",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
              <Activity className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Medical Record Management
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Modern, secure, and intelligent healthcare management system for the digital age
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage healthcare records efficiently
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-card)" }}>
                <CardHeader>
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ background: "var(--gradient-primary)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="h-12 w-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Management?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of healthcare providers using our platform to deliver better patient care
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 MedRecord System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
