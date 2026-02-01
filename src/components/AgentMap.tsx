import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;

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

interface AgentMapProps {
  agents: Agent[];
  selectedAgent?: Agent | null;
  onAgentSelect?: (agent: Agent) => void;
}

// Custom marker icons by network
const createNetworkIcon = (network: string, isOpen: boolean) => {
  const colors: Record<string, string> = {
    Airtel: "#ef4444",
    Orange: "#f97316",
    Vodacom: "#3b82f6",
  };
  const color = colors[network] || "#6b7280";
  const opacity = isOpen ? 1 : 0.5;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        opacity: ${opacity};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">${network[0]}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Component to handle map view changes
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const AgentMap = ({ agents, selectedAgent, onAgentSelect }: AgentMapProps) => {
  // Center on Kinshasa, DRC
  const defaultCenter: [number, number] = [-4.4419, 15.2663];
  const center: [number, number] = selectedAgent 
    ? [selectedAgent.lat, selectedAgent.lng] 
    : defaultCenter;
  const zoom = selectedAgent ? 16 : 13;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} zoom={zoom} />
      
      {agents.map((agent) => (
        <Marker
          key={agent.id}
          position={[agent.lat, agent.lng]}
          icon={createNetworkIcon(agent.network, agent.isOpen)}
          eventHandlers={{
            click: () => onAgentSelect?.(agent),
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-sm">{agent.name}</h3>
              <p className="text-xs text-gray-600">{agent.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium ${agent.isOpen ? "text-green-600" : "text-red-600"}`}>
                  {agent.isOpen ? "Ouvert" : "Fermé"}
                </span>
                <span className="text-xs text-gray-500">{agent.hours}</span>
              </div>
              <a 
                href={`tel:${agent.phone}`} 
                className="text-xs text-blue-600 hover:underline mt-1 block"
              >
                {agent.phone}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AgentMap;
