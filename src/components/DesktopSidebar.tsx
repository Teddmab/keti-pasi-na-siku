import { Home, Clock, MapPin, Settings, Wallet, LogOut, Bell, CreditCard, Scan } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useUSSDMode } from "@/context/USSDModeContext";

interface DesktopSidebarProps {
  active: "home" | "history" | "agents" | "settings";
}

const DesktopSidebar = ({ active }: DesktopSidebarProps) => {
  const navigate = useNavigate();
  const { userName, userPhone, userInitials, notifications } = useUser();
  const { toggleUSSDMode } = useUSSDMode();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: "home" as const, icon: Home, label: "Accueil", path: "/home" },
    { id: "history" as const, icon: Clock, label: "Historique", path: "/history" },
    { id: "agents" as const, icon: MapPin, label: "Agents", path: "/agents" },
    { id: "settings" as const, icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  const quickActions = [
    { icon: CreditCard, label: "Mes Cartes", path: "/cards" },
    { icon: Scan, label: "Scanner QR", path: "/scanner" },
  ];

  // Long press handler for admin access
  const handleLogoLongPress = () => {
    navigate("/admin");
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo - Long press for admin */}
      <div className="p-6 border-b border-border">
        <button 
          onDoubleClick={handleLogoLongPress}
          className="flex items-center gap-3 cursor-pointer"
          title="Double-cliquez pour accéder au dashboard admin"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">K</span>
          </div>
          <div>
            <span className="text-xl font-bold text-foreground block">KETNEY</span>
            <span className="text-[10px] text-muted-foreground">Agrément BCC - EME</span>
          </div>
        </button>
      </div>

      {/* User Profile Mini */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{userName.split(" ")[0]} {userName.split(" ")[1]?.[0]}.</p>
            <p className="text-xs text-muted-foreground">+243 {userPhone}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active === item.id
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
          
          {/* Quick Actions */}
          <li className="pt-4 border-t border-border mt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-4">Actions rapides</p>
          </li>
          {quickActions.map((action) => (
            <li key={action.label}>
              <button
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </button>
            </li>
          ))}
          
          {/* Notifications link */}
          <li>
            <button
              onClick={() => navigate("/notifications")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Notifications</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={toggleUSSDMode}
          className="w-full flex items-center gap-3 px-4 py-2 mb-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-sm"
        >
          <Wallet className="w-4 h-4" />
          <span>Mode Bas Débit</span>
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
        <p className="text-xs text-muted-foreground text-center mt-4">KETNEY v1.0.0</p>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
