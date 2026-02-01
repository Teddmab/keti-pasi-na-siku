import { ArrowUpRight, ArrowDownLeft, Wallet, RotateCcw } from "lucide-react";

interface TransactionItemProps {
  type: "sent" | "received" | "cashin" | "cashout";
  recipient: string;
  network: "Airtel" | "Orange" | "Vodacom";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  isLast?: boolean;
}

const TransactionItem = ({
  type,
  recipient,
  network,
  amount,
  status,
  date,
  isLast = false,
}: TransactionItemProps) => {
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
    }
  };

  const getLabel = () => {
    switch (type) {
      case "sent":
        return `À ${recipient}`;
      case "received":
        return `De ${recipient}`;
      case "cashin":
        return `Cash In`;
      case "cashout":
        return `Cash Out`;
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
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const getStatusIcon = () => {
    if (status === "completed") {
      return "✓";
    }
    return null;
  };

  return (
    <div className={`transaction-item ${!isLast ? "border-b border-border" : ""}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconBg()}`}>
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
      
      <div className="text-right">
        <p className={`font-semibold ${type === "received" || type === "cashin" ? "text-accent" : "text-foreground"}`}>
          {type === "received" || type === "cashin" ? "+" : "-"}{formatCurrency(amount)} CDF
        </p>
        {status === "completed" && (
          <span className="text-xs text-accent">{getStatusIcon()}</span>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
