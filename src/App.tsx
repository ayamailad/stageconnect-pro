import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SupervisorInterns from "./pages/supervisor/Interns";
import Users from "./pages/admin/Users";
import Applications from "./pages/admin/Applications";
import Internships from "./pages/admin/Internships";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <div className="min-h-screen">
                  <Header />
                  <Landing />
                </div>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } 
            />
            <Route 
              path="/supervisor/dashboard" 
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } 
            />
            <Route 
              path="/supervisor/interns" 
              element={
                <DashboardLayout>
                  <SupervisorInterns />
                </DashboardLayout>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/users" 
              element={
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              } 
            />
            <Route 
              path="/admin/applications" 
              element={
                <DashboardLayout>
                  <Applications />
                </DashboardLayout>
              } 
            />
            <Route 
              path="/admin/internships" 
              element={
                <DashboardLayout>
                  <Internships />
                </DashboardLayout>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
