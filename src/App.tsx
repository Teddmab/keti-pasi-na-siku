import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import AppLayout from "@/components/AppLayout";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import CashIn from "./pages/CashIn";
import CashOut from "./pages/CashOut";
import History from "./pages/History";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
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
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
