import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode, 
  Wallet,
  Bell,
  Scan
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import TransactionItem from "@/components/TransactionItem";

const Home = () => {
  const navigate = useNavigate();
  const [balance] = useState(72000);

  const recentTransactions = [
    {
      id: "1",
      type: "sent" as const,
      recipient: "Sarah M.",
      network: "Orange" as const,
      amount: 15000,
      status: "completed" as const,
      date: "Aujourd'hui, 14:30",
    },
    {
      id: "2",
      type: "received" as const,
      recipient: "Jean K.",
      network: "Airtel" as const,
      amount: 20000,
      status: "completed" as const,
      date: "Aujourd'hui, 10:15",
    },
    {
      id: "3",
      type: "cashin" as const,
      recipient: "Agent Gombe",
      network: "Vodacom" as const,
      amount: 50000,
      status: "completed" as const,
      date: "Hier, 16:45",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 safe-top">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">Bonjour 👋</p>
            <h1 className="text-xl font-bold text-foreground">Jean-Pierre</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
              2
            </span>
          </button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="balance-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 opacity-80" />
            <span className="text-sm opacity-80">Mon solde</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold amount-display">
              {formatCurrency(balance)}
            </span>
            <span className="text-lg font-medium opacity-80">CDF</span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate("/send")}
            className="card-elevated p-5 flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <ArrowUpRight className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Envoyer</span>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate("/receive")}
            className="card-elevated p-5 flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
              <ArrowDownLeft className="w-7 h-7 text-accent-foreground" />
            </div>
            <span className="font-semibold text-foreground">Recevoir</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="flex gap-3">
          <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5" />
            <span>Cash In</span>
          </button>
          <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5" />
            <span>Cash Out</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Transactions récentes</h2>
          <button 
            onClick={() => navigate("/history")}
            className="text-primary font-medium text-sm"
          >
            Voir tout
          </button>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card-elevated overflow-hidden"
        >
          {recentTransactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              {...transaction}
              isLast={index === recentTransactions.length - 1}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating QR Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-24 right-6 fab"
      >
        <Scan className="w-6 h-6" />
      </motion.button>

      <BottomNav active="home" />
    </div>
  );
};

export default Home;
