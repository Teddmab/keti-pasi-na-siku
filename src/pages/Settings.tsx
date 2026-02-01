import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Globe, 
  Shield, 
  Fingerprint, 
  HelpCircle, 
  LogOut,
  User,
  Bell,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

interface SettingItem {
  id: string;
  icon: React.ElementType;
  label: string;
  value?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}

const Settings = () => {
  const navigate = useNavigate();

  const settingGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: "Compte",
      items: [
        { id: "profile", icon: User, label: "Mon profil", value: "Jean-Pierre" },
        { id: "kyc", icon: FileText, label: "Niveau KYC", value: "Niveau 1", badge: "Améliorer" },
        { id: "notifications", icon: Bell, label: "Notifications" },
      ],
    },
    {
      title: "Sécurité",
      items: [
        { id: "pin", icon: Shield, label: "Changer le code PIN" },
        { id: "biometric", icon: Fingerprint, label: "Biométrie", value: "Activée" },
      ],
    },
    {
      title: "Préférences",
      items: [
        { id: "language", icon: Globe, label: "Langue", value: "Français" },
      ],
    },
    {
      title: "Support",
      items: [
        { id: "help", icon: HelpCircle, label: "Aide & Support" },
        { id: "logout", icon: LogOut, label: "Se déconnecter", danger: true, onClick: () => navigate("/") },
      ],
    },
  ];

  return (
    <div className="page-container safe-top">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card-elevated p-5 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">JP</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">Jean-Pierre Kabongo</h2>
            <p className="text-muted-foreground">+243 089 000 1234</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Settings Groups */}
      <div className="px-6 space-y-6">
        {settingGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              {group.title}
            </h3>
            <div className="card-elevated overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50 ${
                    itemIndex < group.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.danger ? "bg-destructive/10" : "bg-secondary"
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.danger ? "text-destructive" : "text-foreground"
                    }`} />
                  </div>
                  
                  <span className={`flex-1 text-left font-medium ${
                    item.danger ? "text-destructive" : "text-foreground"
                  }`}>
                    {item.label}
                  </span>
                  
                  {item.value && (
                    <span className="text-muted-foreground text-sm">{item.value}</span>
                  )}
                  
                  {item.badge && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {item.badge}
                    </span>
                  )}
                  
                  {!item.danger && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Version */}
      <div className="px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">KETNEY v1.0.0</p>
      </div>

      <BottomNav active="settings" />
    </div>
  );
};

export default Settings;
