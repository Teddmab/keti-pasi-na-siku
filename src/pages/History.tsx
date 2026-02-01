import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import TransactionItem from "@/components/TransactionItem";
import TransactionReceipt from "@/components/TransactionReceipt";
import TransactionSkeleton from "@/components/TransactionSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser, Transaction } from "@/context/UserContext";

type FilterType = "all" | "sent" | "received" | "cashin" | "cashout" | "bill";

const History = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { transactions } = useUser();

  // Simulate loading when navigating to history
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [location.key]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === "all" || t.type === filter;
    const matchesSearch = searchQuery === "" || 
      t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transactionRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "sent", label: "Envoyés" },
    { value: "received", label: "Reçus" },
    { value: "cashin", label: "Cash In" },
    { value: "cashout", label: "Cash Out" },
    { value: "bill", label: "Factures" },
  ];

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setReceiptOpen(true);
  };

  return (
    <div className={isMobile ? "pb-24 safe-top" : "py-2"}>
      {/* Header */}
      <div className={isMobile ? "px-6 pt-6 pb-4" : "mb-6"}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-2xl"}`}>
            Historique
          </h1>
          <button className="w-10 h-10 lg:w-auto lg:px-4 lg:py-2 rounded-full lg:rounded-xl bg-secondary flex items-center justify-center gap-2 hover:bg-muted transition-colors">
            <Download className="w-5 h-5 text-foreground" />
            <span className="hidden lg:inline font-medium text-foreground">Télécharger PDF</span>
          </button>
        </div>

        {/* Search - Desktop */}
        {!isMobile && (
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une transaction..."
              className="input-field pl-12"
            />
          </div>
        )}

        {/* Filters */}
        <div className={`flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide ${isMobile ? "-mx-6 px-6" : ""}`}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className={isMobile ? "px-6" : ""}>
        {isLoading ? (
          <TransactionSkeleton count={5} />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="card-elevated overflow-hidden"
          >
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  isLast={index === filteredTransactions.length - 1}
                  onClick={() => handleTransactionClick(transaction)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Aucune transaction trouvée</p>
              </div>
            )}
          </motion.div>
        )}
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

export default History;
