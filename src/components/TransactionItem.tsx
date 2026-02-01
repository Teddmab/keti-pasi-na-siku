import { ArrowUpRight, ArrowDownLeft, Wallet, RotateCcw, ReceiptText, ChevronRight } from "lucide-react";
import { Transaction } from "@/context/UserContext";

interface TransactionItemProps {
  transaction: Transaction;
  isLast?: boolean;
  onClick?: () => void;
}

const TransactionItem = ({
  transaction,
  isLast = false,
  onClick,
}: TransactionItemProps) => {
  const { type, recipient, network, amount, status, date } = transaction;

  const getIcon = () => {
    switch (type) {
      case "sent":
        return <ArrowUpRight className="w-5 h-5" />;
      case "received":
        return <ArrowDownLeft className="w-5 h-5" />;
      case "cashin":
        return <Wallet className="w-5 h-5" />;
      case "cashout":
        return <RotateCcw className="w-5 h-5" />;
      case "bill":
        return <ReceiptText className="w-5 h-5" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "sent":
        return "bg-primary/10 text-primary";
      case "received":
        return "bg-accent/10 text-accent";
      case "cashin":
        return "bg-accent/10 text-accent";
      case "cashout":
        return "bg-muted text-muted-foreground";
      case "bill":
        return "bg-yellow-500/10 text-yellow-600";
    }
  };

  const getLabel = () => {
    switch (type) {
      case "sent":
        return `À ${recipient}`;
      case "received":
        return `De ${recipient}`;
      case "cashin":
        return recipient;
      case "cashout":
        return recipient;
      case "bill":
        return recipient;
    }
  };

  const getNetworkColor = () => {
    switch (network) {
      case "Airtel":
        return "text-red-500";
      case "Orange":
        return "text-primary";
      case "Vodacom":
        return "text-blue-500";
      case "Ketney":
        return "text-accent";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <span className="text-xs text-accent">✓</span>;
      case "pending":
        return <span className="text-xs text-yellow-500 animate-pulse">⏳</span>;
      case "failed":
        return <span className="text-xs text-destructive">✗</span>;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`transaction-item w-full text-left ${!isLast ? "border-b border-border" : ""}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBg()}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{getLabel()}</p>
          <span className={`text-xs font-medium ${getNetworkColor()}`}>
            {network}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
      
      <div className="text-right flex items-center gap-2">
        <div>
          <p className={`font-semibold ${type === "received" || type === "cashin" ? "text-accent" : "text-foreground"}`}>
            {type === "received" || type === "cashin" ? "+" : "-"}{formatCurrency(amount)} FC
          </p>
          {getStatusBadge()}
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </button>
  );
};

export default TransactionItem;
