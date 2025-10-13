import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupContext from "./pages/SignupContext";
import Dashboard from "./pages/Dashboard";
import JdUpload from "./pages/workspace/JdUpload";
import JdConfirm from "./pages/workspace/JdConfirm";
import CandidateSource from "./pages/workspace/CandidateSource";
import CandidatePreview from "./pages/workspace/CandidatePreview";
import BookCall from "./pages/workspace/BookCall";
import Checkout from "./pages/Checkout";
import ProjectFolder from "./pages/ProjectFolder";
import AccountSettings from "./pages/AccountSettings";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/Dashboard";
import OpsConsole from "./pages/OpsConsole";
import ActiveProjects from "./pages/admin/ActiveProjects";
import NotFound from "./pages/NotFound";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/context" element={<SignupContext />} />
          
          <Route path="/workspace" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/workspace/new/jd-upload" element={
            <ProtectedRoute>
              <JdUpload />
            </ProtectedRoute>
          } />
          <Route path="/workspace/new/jd-confirm" element={
            <ProtectedRoute>
              <JdConfirm />
            </ProtectedRoute>
          } />
          <Route path="/workspace/new/candidate-source" element={
            <ProtectedRoute>
              <CandidateSource />
            </ProtectedRoute>
          } />
          <Route path="/workspace/new/candidate-preview" element={
            <ProtectedRoute>
              <CandidatePreview />
            </ProtectedRoute>
          } />
          <Route path="/workspace/new/book-call" element={
            <ProtectedRoute>
              <BookCall />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="/workspace/project/:projectId" element={
            <ProtectedRoute>
              <ProjectFolder />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/login" element={<AdminAuth />} />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/ops" element={
            <ProtectedRoute requireAdmin={true}>
              <OpsConsole />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/projects" element={
            <ProtectedRoute requireAdmin={true}>
              <ActiveProjects />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
