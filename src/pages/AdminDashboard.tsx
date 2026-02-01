import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Server,
  Database,
  Wifi,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import mockApi from "@/lib/mockApi";

interface AdminStats {
  totalTransactions: number;
  totalVolume: number;
  activeUsers: number;
  systemHealth: number;
  transactionHistory: { time: string; count: number; volume: number }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await mockApi.getAdminStats();
      if (response.success) {
        setStats(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B FC`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M FC`;
    }
    return `${value.toLocaleString()} FC`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const systemServices = [
    { name: "API Gateway", status: "operational", icon: Server },
    { name: "Base de données", status: "operational", icon: Database },
    { name: "Services de paiement", status: "operational", icon: DollarSign },
    { name: "Réseau mobile", status: "degraded", icon: Wifi },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tableau de bord Admin</h1>
            <p className="text-sm text-muted-foreground">
              Agrément BCC - Émetteur de Monnaie Électronique
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Dernière mise à jour</p>
            <p className="text-sm font-medium text-foreground">
              {lastUpdated.toLocaleTimeString("fr-CD")}
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="p-2 rounded-full bg-card hover:bg-secondary transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-foreground ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Transactions totales</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats ? formatNumber(stats.totalTransactions) : "..."}
          </p>
          <p className="text-xs text-accent">+12.5% aujourd'hui</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Volume total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats ? formatCurrency(stats.totalVolume) : "..."}
          </p>
          <p className="text-xs text-accent">+8.3% cette semaine</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Utilisateurs actifs</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats ? formatNumber(stats.activeUsers) : "..."}
          </p>
          <p className="text-xs text-accent">+234 nouveaux</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Santé système</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats ? `${stats.systemHealth}%` : "..."}
          </p>
          <p className="text-xs text-green-500">Opérationnel</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-elevated p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Transactions en temps réel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.transactionHistory || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#colorCount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card-elevated p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Volume de transactions (FC)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.transactionHistory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Volume"]}
                />
                <Line type="monotone" dataKey="volume" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card-elevated p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">État des services - Conformité AML/KYC</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemServices.map((service) => (
            <div
              key={service.name}
              className={`p-4 rounded-xl border ${
                service.status === "operational" 
                  ? "border-green-500/30 bg-green-500/5" 
                  : "border-yellow-500/30 bg-yellow-500/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <service.icon className={`w-5 h-5 ${
                  service.status === "operational" ? "text-green-500" : "text-yellow-500"
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{service.name}</p>
                  <div className="flex items-center gap-1">
                    {service.status === "operational" ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">Opérationnel</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-500">Dégradé</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
