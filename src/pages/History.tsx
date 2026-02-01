import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter } from "lucide-react";
import TransactionItem from "@/components/TransactionItem";
import { useIsMobile } from "@/hooks/use-mobile";

type FilterType = "all" | "sent" | "received" | "cashin" | "cashout";

const History = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const isMobile = useIsMobile();

  const allTransactions = [
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
    {
      id: "4",
      type: "sent" as const,
      recipient: "Marie L.",
      network: "Airtel" as const,
      amount: 8000,
      status: "completed" as const,
      date: "Hier, 09:20",
    },
    {
      id: "5",
      type: "received" as const,
      recipient: "Papa",
      network: "Orange" as const,
      amount: 100000,
      status: "completed" as const,
      date: "20 Jan, 18:00",
    },
    {
      id: "6",
      type: "cashout" as const,
      recipient: "Agent Bandal",
      network: "Vodacom" as const,
      amount: 30000,
      status: "completed" as const,
      date: "19 Jan, 14:30",
    },
  ];

  const filteredTransactions = allTransactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "sent", label: "Envoyés" },
    { value: "received", label: "Reçus" },
    { value: "cashin", label: "Cash In" },
    { value: "cashout", label: "Cash Out" },
  ];

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

        {/* Filters */}
        <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide ${isMobile ? "-mx-6 px-6" : ""}`}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
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
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card-elevated overflow-hidden"
        >
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                {...transaction}
                isLast={index === filteredTransactions.length - 1}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Aucune transaction trouvée</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
