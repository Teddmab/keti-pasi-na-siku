import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { USSDModeProvider, useUSSDMode } from "@/context/USSDModeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AppLayout from "@/components/AppLayout";
import USSDInterface from "@/components/USSDInterface";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import CashIn from "./pages/CashIn";
import CashOut from "./pages/CashOut";
import History from "./pages/History";
import Agents from "./pages/Agents";
import Merchants from "./pages/Merchants";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Notifications from "./pages/Notifications";
import VirtualCards from "./pages/VirtualCards";
import QRScanner from "./pages/QRScanner";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isUSSDMode } = useUSSDMode();

  if (isUSSDMode) {
    return <USSDInterface />;
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout><Welcome /></AppLayout>} />
      <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
      <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/send" element={<AppLayout><Send /></AppLayout>} />
      <Route path="/receive" element={<AppLayout><Receive /></AppLayout>} />
      <Route path="/cash-in" element={<AppLayout><CashIn /></AppLayout>} />
      <Route path="/cash-out" element={<AppLayout><CashOut /></AppLayout>} />
      <Route path="/history" element={<AppLayout><History /></AppLayout>} />
      <Route path="/agents" element={<AppLayout><Agents /></AppLayout>} />
      <Route path="/merchants" element={<AppLayout><Merchants /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      <Route path="/support" element={<AppLayout><Support /></AppLayout>} />
      <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
      <Route path="/cards" element={<AppLayout showNav={false}><VirtualCards /></AppLayout>} />
      <Route path="/scanner" element={<QRScanner />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider>
        <USSDModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-center" />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </USSDModeProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
