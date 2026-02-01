import { Home, Clock, Scan } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/home" || path === "/") return "home";
    if (path === "/history") return "history";
    if (path === "/scanner") return "scanner";
    return "home";
  };
  
  const active = getActiveTab();

  const navItems = [
    { id: "home" as const, icon: Home, label: "Accueil", path: "/home" },
    { id: "scanner" as const, icon: Scan, label: "Scanner", path: "/scanner", isCenter: true },
    { id: "history" as const, icon: Clock, label: "Historique", path: "/history" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border safe-bottom z-40">
      <div className="flex items-center justify-around py-2 px-6 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center justify-center ${item.isCenter ? "flex-none" : "flex-1"}`}
          >
            {item.isCenter ? (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 -mt-5 rounded-full bg-primary flex items-center justify-center shadow-lg"
              >
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-0.5 py-1">
                <item.icon className={`w-6 h-6 transition-colors ${active === item.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[11px] font-medium ${active === item.id ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
