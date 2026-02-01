import { Home, Clock, MapPin, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  active: "home" | "history" | "agents" | "settings";
}

const BottomNav = ({ active }: BottomNavProps) => {
  const navigate = useNavigate();

  const navItems = [
    { id: "home" as const, icon: Home, label: "Accueil", path: "/home" },
    { id: "history" as const, icon: Clock, label: "Historique", path: "/history" },
    { id: "agents" as const, icon: MapPin, label: "Agents", path: "/agents" },
    { id: "settings" as const, icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`nav-item ${active === item.id ? "active" : ""}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
