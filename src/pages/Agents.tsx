import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Agent {
  id: string;
  name: string;
  network: "Airtel" | "Orange" | "Vodacom";
  address: string;
  distance: string;
  isOpen: boolean;
  hours: string;
  phone: string;
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Agent Orange – Gombe",
    network: "Orange",
    address: "Avenue du Commerce, Gombe",
    distance: "350 m",
    isOpen: true,
    hours: "8h - 18h",
    phone: "+243 999 000 111",
  },
  {
    id: "2",
    name: "Agent Airtel – Bandal",
    network: "Airtel",
    address: "Boulevard Lumumba, Bandal",
    distance: "1.2 km",
    isOpen: false,
    hours: "9h - 17h",
    phone: "+243 999 000 222",
  },
  {
    id: "3",
    name: "Agent Vodacom – Limete",
    network: "Vodacom",
    address: "Avenue des Poids Lourds, Limete",
    distance: "2.5 km",
    isOpen: true,
    hours: "7h - 20h",
    phone: "+243 999 000 333",
  },
  {
    id: "4",
    name: "Agent Orange – Matonge",
    network: "Orange",
    address: "Rue Kabinda, Matonge",
    distance: "3.1 km",
    isOpen: true,
    hours: "8h - 19h",
    phone: "+243 999 000 444",
  },
];

const Agents = () => {
  const isMobile = useIsMobile();

  const getNetworkColor = (network: string) => {
    switch (network) {
      case "Airtel":
        return "bg-red-500";
      case "Orange":
        return "bg-primary";
      case "Vodacom":
        return "bg-blue-500";
      default:
        return "bg-muted";
    }
  };

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "Airtel":
        return "📱";
      case "Orange":
        return "🟠";
      case "Vodacom":
        return "📲";
      default:
        return "📍";
    }
  };

  return (
    <div className={isMobile ? "pb-24 safe-top" : "py-2"}>
      {/* Header */}
      <div className={isMobile ? "px-6 pt-6 pb-4" : "mb-6"}>
        <h1 className="text-2xl font-bold text-foreground mb-2">Agents autour de vous</h1>
        <p className="text-muted-foreground">Trouvez un agent proche pour Cash In / Cash Out</p>
      </div>

      {/* Desktop: Side by side layout */}
      <div className={`grid gap-6 ${isMobile ? "" : "lg:grid-cols-2"}`}>
        {/* Map Placeholder */}
        <div className={isMobile ? "px-6 mb-6" : ""}>
          <div className={`bg-secondary rounded-3xl flex items-center justify-center overflow-hidden relative ${isMobile ? "h-40" : "h-80 lg:h-full lg:min-h-[400px]"}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
            <div className="text-center z-10">
              <MapPin className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Carte des agents</p>
              <p className="text-xs text-muted-foreground mt-1">Intégration Google Maps</p>
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className={isMobile ? "px-6" : ""}>
          {/* Search on Desktop */}
          {!isMobile && (
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un agent..."
                className="input-field pl-12"
              />
            </div>
          )}

          <h2 className={`text-lg font-bold text-foreground mb-4 ${isMobile ? "" : "hidden"}`}>
            Liste des agents
          </h2>
          
          <div className="space-y-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-4 hover:scale-[1.01] transition-transform cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${getNetworkColor(agent.network)} flex items-center justify-center text-xl`}>
                    {getNetworkIcon(agent.network)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{agent.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        agent.isOpen 
                          ? "bg-accent/10 text-accent" 
                          : "bg-destructive/10 text-destructive"
                      }`}>
                        {agent.isOpen ? "Ouvert" : "Fermé"}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{agent.address}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <MapPin className="w-4 h-4" />
                        {agent.distance}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {agent.hours}
                      </span>
                    </div>
                  </div>
                  
                  <a
                    href={`tel:${agent.phone}`}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
