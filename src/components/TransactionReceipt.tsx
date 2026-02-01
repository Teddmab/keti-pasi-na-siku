import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownLeft, Wallet, ReceiptText } from "lucide-react";
import { Transaction } from "@/context/UserContext";

interface TransactionReceiptProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionReceipt = ({ transaction, isOpen, onClose }: TransactionReceiptProps) => {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CD").format(amount);
  };

  const getTypeLabel = () => {
    switch (transaction.type) {
      case "sent":
        return "Envoi d'argent";
      case "received":
        return "Argent reçu";
      case "cashin":
        return "Dépôt (Cash In)";
      case "cashout":
        return "Retrait (Cash Out)";
      case "bill":
        return "Paiement de facture";
    }
  };

  const getTypeIcon = () => {
    switch (transaction.type) {
      case "sent":
        return <ArrowUpRight className="w-6 h-6" />;
      case "received":
        return <ArrowDownLeft className="w-6 h-6" />;
      case "cashin":
        return <Wallet className="w-6 h-6" />;
      case "cashout":
        return <Wallet className="w-6 h-6" />;
      case "bill":
        return <ReceiptText className="w-6 h-6" />;
    }
  };

  const getStatusConfig = () => {
    switch (transaction.status) {
      case "completed":
        return { icon: CheckCircle, label: "Succès", color: "text-accent", bg: "bg-accent/10" };
      case "pending":
        return { icon: Clock, label: "En attente", color: "text-yellow-500", bg: "bg-yellow-500/10" };
      case "failed":
        return { icon: XCircle, label: "Échoué", color: "text-destructive", bg: "bg-destructive/10" };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 top-auto max-h-[85vh] bg-card rounded-3xl shadow-xl z-50 overflow-hidden flex flex-col lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Reçu de transaction</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Status Badge */}
              <div className="flex justify-center mb-6">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg}`}>
                  <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                  <span className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-center mb-6">
                <p className="text-muted-foreground text-sm mb-1">{getTypeLabel()}</p>
                <p className={`text-4xl font-extrabold ${
                  transaction.type === "received" || transaction.type === "cashin"
                    ? "text-accent"
                    : "text-foreground"
                }`}>
                  {transaction.type === "received" || transaction.type === "cashin" ? "+" : "-"}
                  {formatCurrency(transaction.amount)} FC
                </p>
              </div>

              {/* Transaction Details */}
              <div className="card-elevated p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ID Transaction</span>
                  <span className="font-mono text-sm font-medium text-foreground">{transaction.transactionRef}</span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {transaction.type === "received" ? "De" : "À"}
                  </span>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{transaction.recipient}</p>
                    {transaction.recipientPhone && (
                      <p className="text-sm text-muted-foreground">+243 {transaction.recipientPhone}</p>
                    )}
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Réseau</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{transaction.network}</span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date & Heure</span>
                  <span className="font-medium text-foreground">{transaction.date}</span>
                </div>

                {transaction.fee > 0 && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Frais</span>
                      <span className="font-medium text-foreground">{formatCurrency(transaction.fee)} FC</span>
                    </div>
                  </>
                )}

                {(transaction.type === "sent" || transaction.type === "cashout" || transaction.type === "bill") && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total débité</span>
                      <span className="font-bold text-primary">{formatCurrency(transaction.amount + transaction.fee)} FC</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border flex gap-3">
              <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Télécharger
              </button>
              <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Partager
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionReceipt;
