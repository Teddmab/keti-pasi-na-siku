import { Home, Clock, MapPin, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface BottomNavProps {
  active: "home" | "history" | "agents" | "settings";
}

const BottomNav = ({ active }: BottomNavProps) => {
  const navigate = useNavigate();
  const { notifications } = useUser();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: "home" as const, icon: Home, label: "Accueil", path: "/home" },
    { id: "history" as const, icon: Clock, label: "Historique", path: "/history" },
    { id: "agents" as const, icon: MapPin, label: "Agents", path: "/agents" },
    { id: "settings" as const, icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`nav-item relative ${active === item.id ? "active" : ""}`}
          >
            <div className="relative">
              <item.icon className={`w-6 h-6 transition-colors ${active === item.id ? "text-primary" : ""}`} />
              {/* Active indicator dot */}
              {active === item.id && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </div>
            <span className={`text-xs font-medium ${active === item.id ? "text-primary" : ""}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
