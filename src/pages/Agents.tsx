import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Search, Map, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import AgentMap from "@/components/AgentMap";

interface Agent {
  id: string;
  name: string;
  network: "Airtel" | "Orange" | "Vodacom";
  address: string;
  distance: string;
  isOpen: boolean;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
}

// Real Kinshasa locations
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
    lat: -4.3106,
    lng: 15.3127,
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
    lat: -4.3405,
    lng: 15.2917,
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
    lat: -4.3562,
    lng: 15.3389,
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
    lat: -4.3283,
    lng: 15.3094,
  },
  {
    id: "5",
    name: "Agent Airtel – Ngaliema",
    network: "Airtel",
    address: "Avenue de la Libération, Ngaliema",
    distance: "4.2 km",
    isOpen: true,
    hours: "8h - 18h",
    phone: "+243 999 000 555",
    lat: -4.3242,
    lng: 15.2543,
  },
  {
    id: "6",
    name: "Agent Vodacom – Masina",
    network: "Vodacom",
    address: "Avenue Kabambare, Masina",
    distance: "5.8 km",
    isOpen: true,
    hours: "6h - 21h",
    phone: "+243 999 000 666",
    lat: -4.3891,
    lng: 15.3812,
  },
];

const Agents = () => {
  const isMobile = useIsMobile();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(!isMobile);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.network.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    if (isMobile) {
      setShowMap(true);
    }
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="pb-24 safe-top">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Agents autour de vous</h1>
          <p className="text-muted-foreground">Trouvez un agent proche pour Cash In / Cash Out</p>
        </div>

        {/* Search */}
        <div className="px-6 mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un agent..."
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Map/List Toggle */}
        {showMap ? (
          <div className="px-6 mb-4">
            <div className="h-64 rounded-3xl overflow-hidden">
              <AgentMap 
                agents={filteredAgents} 
                selectedAgent={selectedAgent}
                onAgentSelect={setSelectedAgent}
              />
            </div>
            <button
              onClick={() => setShowMap(false)}
              className="mt-4 btn-secondary w-full flex items-center justify-center gap-2"
            >
              <List className="w-5 h-5" />
              Voir la liste
            </button>
          </div>
        ) : (
          <>
            {/* Agent List */}
            <div className="px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Liste des agents</h2>
                <span className="text-sm text-muted-foreground">{filteredAgents.length} agents</span>
              </div>
              
              <div className="space-y-4">
                {filteredAgents.map((agent, index) => (
                  <motion.button
                    key={agent.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleAgentClick(agent)}
                    className={`w-full card-elevated p-4 text-left transition-all ${
                      selectedAgent?.id === agent.id ? "ring-2 ring-primary" : ""
                    }`}
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
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Floating Map Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              onClick={() => setShowMap(true)}
              className="fixed bottom-24 right-6 fab"
            >
              <Map className="w-6 h-6" />
            </motion.button>
          </>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Agents autour de vous</h1>
        <p className="text-muted-foreground">Trouvez un agent proche pour Cash In / Cash Out</p>
      </div>

      {/* Desktop: Side by side layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="h-[500px] rounded-3xl overflow-hidden">
          <AgentMap 
            agents={filteredAgents} 
            selectedAgent={selectedAgent}
            onAgentSelect={setSelectedAgent}
          />
        </div>

        {/* Agent List */}
        <div>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un agent..."
              className="input-field pl-12"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Liste des agents</h2>
            <span className="text-sm text-muted-foreground">{filteredAgents.length} agents trouvés</span>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {filteredAgents.map((agent, index) => (
              <motion.button
                key={agent.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAgentClick(agent)}
                className={`w-full card-elevated p-4 text-left hover:scale-[1.01] transition-all cursor-pointer ${
                  selectedAgent?.id === agent.id ? "ring-2 ring-primary" : ""
                }`}
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
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
