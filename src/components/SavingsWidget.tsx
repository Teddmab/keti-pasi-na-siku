import { motion } from "framer-motion";
import { PiggyBank, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SavingsWidgetProps {
  goal: number;
  current: number;
  title?: string;
}

const SavingsWidget = ({ goal, current, title = "Ma Tirelire" }: SavingsWidgetProps) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <PiggyBank className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">Objectif d'épargne</p>
        </div>
        <div className="flex items-center gap-1 text-accent">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">+12%</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progression</span>
          <span className="font-semibold text-primary">{Math.round(percentage)}%</span>
        </div>
        
        <Progress value={percentage} className="h-3" />
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-muted-foreground">Épargné</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(current)} FC</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Objectif</p>
            <p className="text-sm font-medium text-muted-foreground">{formatCurrency(goal)} FC</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SavingsWidget;
