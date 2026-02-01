import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Settings, 
  MapPin, 
  HelpCircle, 
  Bell,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { notifications } = useUser();
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { 
      icon: Bell, 
      label: "Notifications", 
      path: "/notifications",
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { icon: MapPin, label: "Agents", path: "/agents" },
    { icon: CreditCard, label: "Cartes virtuelles", path: "/cards" },
    { icon: HelpCircle, label: "Aide & FAQ", path: "/support" },
    { icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-card z-50 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-foreground">Menu</span>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-secondary/50 active:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                      <item.icon className="w-4.5 h-4.5 text-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="min-w-[20px] h-5 px-1.5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border safe-bottom">
              <div className="text-xs text-muted-foreground text-center">
                KETNEY v1.0.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
