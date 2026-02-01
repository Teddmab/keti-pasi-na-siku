import { motion } from "framer-motion";
import { ArrowLeft, Bell, BellOff, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Notifications = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { notifications, markNotificationRead, clearNotifications } = useUser();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📬";
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-accent/10";
      case "warning":
        return "bg-yellow-500/10";
      case "info":
        return "bg-blue-500/10";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background safe-top">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {notifications.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
              <BellOff className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Aucune notification
            </h2>
            <p className="text-muted-foreground text-center max-w-xs">
              Vous n'avez pas encore de notifications. Elles apparaîtront ici après vos transactions.
            </p>
          </motion.div>
        ) : (
          // Notification List
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markNotificationRead(notification.id)}
                className={`card-elevated p-4 cursor-pointer transition-all hover:scale-[1.01] ${
                  !notification.read ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${getNotificationBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
