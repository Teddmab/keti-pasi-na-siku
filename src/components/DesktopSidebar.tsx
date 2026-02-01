import { Home, Clock, MapPin, Settings, Wallet, LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface DesktopSidebarProps {
  active: "home" | "history" | "agents" | "settings";
}

const DesktopSidebar = ({ active }: DesktopSidebarProps) => {
  const navigate = useNavigate();
  const { userName, userPhone, userInitials, notifications } = useUser();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: "home" as const, icon: Home, label: "Accueil", path: "/home" },
    { id: "history" as const, icon: Clock, label: "Historique", path: "/history" },
    { id: "agents" as const, icon: MapPin, label: "Agents", path: "/agents" },
    { id: "settings" as const, icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">K</span>
          </div>
          <span className="text-xl font-bold text-foreground">KETNEY</span>
        </div>
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
