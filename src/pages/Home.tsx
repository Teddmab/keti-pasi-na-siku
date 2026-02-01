import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode, 
  Wallet,
  Bell,
  Scan,
  TrendingUp,
  Users,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TransactionItem from "@/components/TransactionItem";
import TransactionReceipt from "@/components/TransactionReceipt";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser, Transaction } from "@/context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { balance, balanceVisible, toggleBalanceVisibility, transactions, notifications } = useUser();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const recentTransactions = transactions.slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setReceiptOpen(true);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="pb-24">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 safe-top">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground text-sm">Bonjour 👋</p>
              <h1 className="text-xl font-bold text-foreground">Jean-Pierre</h1>
            </div>
            <button 
              onClick={() => navigate("/notifications")}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center relative"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* Balance Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="balance-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 opacity-80" />
                <span className="text-sm opacity-80">Mon solde</span>
              </div>
              <button 
                onClick={toggleBalanceVisibility}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {balanceVisible ? (
                  <Eye className="w-5 h-5 opacity-80" />
                ) : (
                  <EyeOff className="w-5 h-5 opacity-80" />
                )}
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              {balanceVisible ? (
                <>
                  <span className="text-4xl font-extrabold amount-display">
                    {formatCurrency(balance)}
                  </span>
                  <span className="text-lg font-medium opacity-80">FC</span>
                </>
              ) : (
                <span className="text-4xl font-extrabold">••••••</span>
              )}
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
                transaction={transaction}
                isLast={index === recentTransactions.length - 1}
                onClick={() => handleTransactionClick(transaction)}
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

        {/* Transaction Receipt Modal */}
        <TransactionReceipt
          transaction={selectedTransaction}
          isOpen={receiptOpen}
          onClose={() => setReceiptOpen(false)}
        />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-muted-foreground">Bonjour 👋</p>
          <h1 className="text-2xl font-bold text-foreground">Jean-Pierre Kabongo</h1>
        </div>
        <button 
          onClick={() => navigate("/notifications")}
          className="w-12 h-12 rounded-full bg-card shadow-card flex items-center justify-center relative"
        >
          <Bell className="w-6 h-6 text-foreground" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-bold">
              {unreadNotifications}
            </span>
          )}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card - Larger on Desktop */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-2 balance-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 opacity-80" />
                <span className="text-sm opacity-80">Mon solde disponible</span>
                <button 
                  onClick={toggleBalanceVisibility}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  {balanceVisible ? (
                    <Eye className="w-4 h-4 opacity-80" />
                  ) : (
                    <EyeOff className="w-4 h-4 opacity-80" />
                  )}
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                {balanceVisible ? (
                  <>
                    <span className="text-5xl font-extrabold amount-display">
                      {formatCurrency(balance)}
                    </span>
                    <span className="text-xl font-medium opacity-80">FC</span>
                  </>
                ) : (
                  <span className="text-5xl font-extrabold">••••••••</span>
                )}
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">+12% ce mois</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Contacts fréquents</span>
          </div>
          <div className="flex -space-x-2">
            {["SM", "JK", "ML", "PK"].map((initials, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-bold text-foreground"
              >
                {initials}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-primary border-2 border-card flex items-center justify-center text-xs font-bold text-primary-foreground">
              +5
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons - Horizontal on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/send")}
          className="card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <ArrowUpRight className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-foreground block">Envoyer</span>
            <span className="text-sm text-muted-foreground">Transfert rapide</span>
          </div>
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate("/receive")}
          className="card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
            <ArrowDownLeft className="w-7 h-7 text-accent-foreground" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-foreground block">Recevoir</span>
            <span className="text-sm text-muted-foreground">Via QR code</span>
          </div>
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <QrCode className="w-7 h-7 text-foreground" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-foreground block">Cash In</span>
            <span className="text-sm text-muted-foreground">Dépôt d'argent</span>
          </div>
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <Wallet className="w-7 h-7 text-foreground" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-foreground block">Cash Out</span>
            <span className="text-sm text-muted-foreground">Retrait d'argent</span>
          </div>
        </motion.button>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Transactions récentes</h2>
          <button 
            onClick={() => navigate("/history")}
            className="text-primary font-medium hover:underline"
          >
            Voir tout l'historique →
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
              transaction={transaction}
              isLast={index === recentTransactions.length - 1}
              onClick={() => handleTransactionClick(transaction)}
            />
          ))}
        </motion.div>
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionReceipt
        transaction={selectedTransaction}
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
      />
    </div>
  );
};

export default Home;
