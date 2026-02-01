import { Smartphone, Wifi, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Smartphone, text: "Tous les réseaux en un" },
    { icon: Zap, text: "Transferts instantanés" },
    { icon: Wifi, text: "Sans connexion stable" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-button">
            <span className="text-4xl font-extrabold text-primary-foreground">K</span>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold text-foreground mb-3"
        >
          KETNEY
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-muted-foreground text-center max-w-xs mb-12"
        >
          Envoyez et recevez de l'argent entre tous les réseaux, en toute simplicité.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4 w-full max-w-xs"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 p-4 card-elevated"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-foreground font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="px-6 pb-8 safe-bottom"
      >
        <button
          onClick={() => navigate("/login")}
          className="btn-primary w-full text-lg"
        >
          Commencer
        </button>
      </motion.div>
    </div>
  );
};

export default Welcome;
