import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

interface ExchangeRateWidgetProps {
  rate: number;
  previousRate?: number;
  compact?: boolean;
}

const ExchangeRateWidget = ({ rate, previousRate, compact = false }: ExchangeRateWidgetProps) => {
  const change = previousRate ? ((rate - previousRate) / previousRate) * 100 : 0;
  const isUp = change > 0;
  
  const formatRate = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
        <span className="text-xs text-muted-foreground">USD/FC</span>
        <span className="text-sm font-semibold text-foreground">{formatRate(rate)}</span>
        {change !== 0 && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${isUp ? "text-destructive" : "text-accent"}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="card-elevated p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Taux du jour</span>
        <button className="p-1 hover:bg-secondary rounded-full transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-foreground">1 USD</span>
        <span className="text-muted-foreground">=</span>
        <span className="text-xl font-bold text-primary">{formatRate(rate)} FC</span>
      </div>
      {change !== 0 && (
        <div className={`flex items-center gap-1 mt-1 ${isUp ? "text-destructive" : "text-accent"}`}>
          {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-xs font-medium">{isUp ? "+" : ""}{change.toFixed(2)}% depuis hier</span>
        </div>
      )}
    </motion.div>
  );
};

export default ExchangeRateWidget;
