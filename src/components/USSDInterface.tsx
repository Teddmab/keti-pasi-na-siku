import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUSSDMode } from "@/context/USSDModeContext";
import { useUser } from "@/context/UserContext";

const USSDInterface = () => {
  const navigate = useNavigate();
  const { toggleUSSDMode } = useUSSDMode();
  const { balance } = useUser();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const menuItems = [
    { key: "1", label: "Envoyer de l'argent", path: "/send" },
    { key: "2", label: "Consulter le solde", path: null, info: `${formatCurrency(balance)} FC` },
    { key: "3", label: "Historique", path: "/history" },
    { key: "4", label: "Cash In / Cash Out", path: "/cash-in" },
    { key: "5", label: "Payer marchand", path: "/scanner" },
    { key: "6", label: "Mes cartes", path: "/cards" },
    { key: "0", label: "Quitter mode USSD", path: null, action: toggleUSSDMode },
  ];

  const handleSelect = (item: typeof menuItems[0]) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 safe-top safe-bottom">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="border-2 border-green-400 p-4 mb-4">
          <div className="text-center">
            <h1 className="text-xl font-bold">KETNEY</h1>
            <p className="text-sm opacity-80">Mode Bas Débit</p>
            <p className="text-xs mt-1 opacity-60">Agrément BCC - EME</p>
          </div>
        </div>

        {/* Balance */}
        <div className="border-2 border-green-400 p-4 mb-4">
          <p className="text-sm">Solde disponible:</p>
          <p className="text-2xl font-bold">{formatCurrency(balance)} FC</p>
        </div>

        {/* Menu */}
        <div className="border-2 border-green-400 p-4 space-y-2">
          <p className="text-sm mb-4 border-b border-green-400 pb-2">
            MENU PRINCIPAL
          </p>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelect(item)}
              className="w-full text-left py-2 px-2 hover:bg-green-400/20 transition-colors flex justify-between items-center"
            >
              <span>
                <span className="inline-block w-8">{item.key}.</span>
                {item.label}
              </span>
              {item.info && (
                <span className="text-green-300">{item.info}</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs opacity-60">
          <p>Composez le numéro pour sélectionner</p>
          <p className="mt-2">*123# pour accès rapide</p>
        </div>
      </motion.div>
    </div>
  );
};

export default USSDInterface;
