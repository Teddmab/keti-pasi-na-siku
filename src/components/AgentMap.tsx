import { useEffect, useRef, useState } from "react";
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

// Mock current user location (Kinshasa center)
const USER_LOCATION: L.LatLngExpression = [-4.3250, 15.3100];

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
        width: 32px;
        height: 32px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        opacity: ${opacity};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">${network[0]}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// User location marker
const createUserIcon = () => {
  return L.divIcon({
    className: "user-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
      ">
        <div style="
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Generate a simple curved route between two points
const generateRoute = (start: L.LatLngExpression, end: L.LatLngExpression): L.LatLngExpression[] => {
  const startArr = Array.isArray(start) ? start : [start.lat, start.lng];
  const endArr = Array.isArray(end) ? end : [end.lat, end.lng];
  
  const points: L.LatLngExpression[] = [];
  const steps = 20;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Add slight curve for visual effect
    const curve = Math.sin(t * Math.PI) * 0.002;
    const lat = startArr[0] + (endArr[0] - startArr[0]) * t + curve;
    const lng = startArr[1] + (endArr[1] - startArr[1]) * t;
    points.push([lat, lng] as L.LatLngExpression);
  }
  
  return points;
};

const AgentMap = ({ agents, selectedAgent, onAgentSelect }: AgentMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    // Add user location marker
    const userMarker = L.marker(USER_LOCATION, {
      icon: createUserIcon(),
    }).addTo(map);
    userMarker.bindPopup("<strong>Votre position</strong>");
    userMarkerRef.current = userMarker;

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

    // Clear existing markers (except user marker)
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    agents.forEach((agent) => {
      const marker = L.marker([agent.lat, agent.lng], {
        icon: createNetworkIcon(agent.network, agent.isOpen),
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 4px; min-width: 150px;">
          <h3 style="font-weight: 600; font-size: 13px; margin: 0 0 4px 0;">${agent.name}</h3>
          <p style="font-size: 11px; color: #666; margin: 0 0 4px 0;">${agent.address}</p>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 500; color: ${agent.isOpen ? "#16a34a" : "#dc2626"};">
              ${agent.isOpen ? "Ouvert" : "Fermé"}
            </span>
            <span style="font-size: 11px; color: #888;">${agent.hours}</span>
          </div>
          <a href="tel:${agent.phone}" style="font-size: 11px; color: #f97316; text-decoration: none; font-weight: 500;">
            📞 ${agent.phone}
          </a>
        </div>
      `);

      marker.on("click", () => {
        onAgentSelect?.(agent);
      });

      markersRef.current.push(marker);
    });
  }, [agents, onAgentSelect]);

  // Handle selected agent changes - show route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing route
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (!selectedAgent) return;

    // Generate and draw route
    const route = generateRoute(USER_LOCATION, [selectedAgent.lat, selectedAgent.lng]);
    const routeLine = L.polyline(route, {
      color: "#f97316",
      weight: 4,
      opacity: 0.8,
      dashArray: "10, 10",
      lineCap: "round",
    }).addTo(map);
    routeLineRef.current = routeLine;

    // Fit bounds to show both user and agent
    const bounds = L.latLngBounds([USER_LOCATION, [selectedAgent.lat, selectedAgent.lng]]);
    map.fitBounds(bounds, {
      padding: [50, 50],
      animate: true,
      duration: 0.5,
    });

    // Open popup for selected agent
    const marker = markersRef.current.find((m) => {
      const pos = m.getLatLng();
      return pos.lat === selectedAgent.lat && pos.lng === selectedAgent.lng;
    });
    if (marker) {
      setTimeout(() => marker.openPopup(), 300);
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
