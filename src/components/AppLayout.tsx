import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

const AppLayout = ({ children, showNav = true }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Determine active nav item
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === "/home") return "home";
    if (path === "/history") return "history";
    if (path === "/agents") return "agents";
    if (path === "/settings") return "settings";
    return "home";
  };

  // Full-screen pages without nav (welcome, login, send, receive, notifications)
  const noNavPages = ["/", "/login", "/send", "/receive", "/notifications"];
  const hideNav = noNavPages.includes(location.pathname) || !showNav;

  if (hideNav) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto min-h-screen bg-background lg:max-w-lg lg:shadow-2xl">
          {children}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto min-h-screen bg-background">
          {children}
          <BottomNav active={getActiveNav()} />
        </div>
      </div>
    );
  }

  // Desktop layout with sidebar
  return (
    <div className="min-h-screen bg-secondary/30 flex">
      <DesktopSidebar active={getActiveNav()} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
