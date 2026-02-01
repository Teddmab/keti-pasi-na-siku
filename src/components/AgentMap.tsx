import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const AgentMap = ({ agents, selectedAgent, onAgentSelect }: AgentMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Center on Kinshasa, DRC
  const defaultCenter: L.LatLngExpression = [-4.3276, 15.3136];

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    agents.forEach((agent) => {
      const marker = L.marker([agent.lat, agent.lng], {
        icon: createNetworkIcon(agent.network, agent.isOpen),
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 4px;">
          <h3 style="font-weight: bold; font-size: 14px; margin: 0 0 4px 0;">${agent.name}</h3>
          <p style="font-size: 12px; color: #666; margin: 0 0 4px 0;">${agent.address}</p>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 12px; font-weight: 500; color: ${agent.isOpen ? "#16a34a" : "#dc2626"};">
              ${agent.isOpen ? "Ouvert" : "Fermé"}
            </span>
            <span style="font-size: 12px; color: #888;">${agent.hours}</span>
          </div>
          <a href="tel:${agent.phone}" style="font-size: 12px; color: #2563eb; text-decoration: none;">
            ${agent.phone}
          </a>
        </div>
      `);

      marker.on("click", () => {
        onAgentSelect?.(agent);
      });

      markersRef.current.push(marker);
    });
  }, [agents, onAgentSelect]);

  // Handle selected agent changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedAgent) return;

    map.setView([selectedAgent.lat, selectedAgent.lng], 16, {
      animate: true,
      duration: 0.5,
    });

    // Open popup for selected agent
    const marker = markersRef.current.find((m) => {
      const pos = m.getLatLng();
      return pos.lat === selectedAgent.lat && pos.lng === selectedAgent.lng;
    });
    if (marker) {
      marker.openPopup();
    }
  }, [selectedAgent]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "1.5rem",
        overflow: "hidden",
      }}
    />
  );
};

export default AgentMap;
