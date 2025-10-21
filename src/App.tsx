import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SupervisorThemes from "./pages/supervisor/Themes";
import SupervisorTasks from "./pages/supervisor/Tasks";
import SupervisorAttendance from "./pages/supervisor/Attendance";
import InternTasks from "./pages/intern/Tasks";
import InternAttendance from "./pages/intern/Attendance";
import Users from "./pages/admin/Users";
import Applications from "./pages/admin/Applications";
import Internships from "./pages/admin/Internships";
import Application from "./pages/Application";
import Forbidden from "./pages/Forbidden";
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
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/applications" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <Applications />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/internships" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <Internships />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Supervisor Routes */}
            <Route 
              path="/supervisor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisor/themes"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <DashboardLayout>
                    <SupervisorThemes />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisor/tasks" 
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <DashboardLayout>
                    <SupervisorTasks />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisor/attendance" 
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <DashboardLayout>
                    <SupervisorAttendance />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Candidate Routes */}
            <Route 
              path="/application" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <DashboardLayout>
                    <Application />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Intern Routes */}
            <Route 
              path="/intern/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/intern/tasks" 
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <DashboardLayout>
                    <InternTasks />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/intern/attendance" 
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <DashboardLayout>
                    <InternAttendance />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* General dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } 
            />
            
            {/* 403 Forbidden Route */}
            <Route path="/forbidden" element={<Forbidden />} />
            
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
