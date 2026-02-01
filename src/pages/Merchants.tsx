import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, MapPin, Star, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface Merchant {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  hours: string;
  image?: string;
}

const merchants: Merchant[] = [
  {
    id: "1",
    name: "Shoprite Gombe",
    category: "Supermarché",
    categoryIcon: "🛒",
    address: "Boulevard du 30 Juin, Gombe",
    distance: "500 m",
    rating: 4.5,
    isOpen: true,
    hours: "8h - 21h",
  },
  {
    id: "2",
    name: "Pharmacie Centrale",
    category: "Pharmacie",
    categoryIcon: "💊",
    address: "Avenue Kasa-Vubu, Barumbu",
    distance: "800 m",
    rating: 4.8,
    isOpen: true,
    hours: "7h - 22h",
  },
  {
    id: "3",
    name: "Restaurant Le Flamboyant",
    category: "Restaurant",
    categoryIcon: "🍽️",
    address: "Rue des Boulangeries, Gombe",
    distance: "1.2 km",
    rating: 4.3,
    isOpen: true,
    hours: "11h - 23h",
  },
  {
    id: "4",
    name: "Station Total Limete",
    category: "Station-service",
    categoryIcon: "⛽",
    address: "Avenue des Poids Lourds, Limete",
    distance: "1.5 km",
    rating: 4.1,
    isOpen: true,
    hours: "24h/24",
  },
  {
    id: "5",
    name: "Boutique Mode Africaine",
    category: "Mode",
    categoryIcon: "👗",
    address: "Avenue de la Victoire, Matonge",
    distance: "2.1 km",
    rating: 4.6,
    isOpen: false,
    hours: "9h - 19h",
  },
  {
    id: "6",
    name: "Électronique Plus",
    category: "Électronique",
    categoryIcon: "📱",
    address: "Boulevard Lumumba, Bandal",
    distance: "2.8 km",
    rating: 4.2,
    isOpen: true,
    hours: "9h - 20h",
  },
  {
    id: "7",
    name: "Boulangerie Le Pain Doré",
    category: "Boulangerie",
    categoryIcon: "🥖",
    address: "Rue Mongala, Lingwala",
    distance: "3.2 km",
    rating: 4.7,
    isOpen: true,
    hours: "6h - 20h",
  },
  {
    id: "8",
    name: "Hôtel Memling",
    category: "Hôtel",
    categoryIcon: "🏨",
    address: "Avenue du Tchad, Gombe",
    distance: "3.5 km",
    rating: 4.9,
    isOpen: true,
    hours: "24h/24",
  },
];

const categories = [
  { id: "all", name: "Tous", icon: "🏪" },
  { id: "supermarche", name: "Supermarché", icon: "🛒" },
  { id: "restaurant", name: "Restaurant", icon: "🍽️" },
  { id: "pharmacie", name: "Pharmacie", icon: "💊" },
  { id: "mode", name: "Mode", icon: "👗" },
  { id: "electronique", name: "Électronique", icon: "📱" },
];

const Merchants = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch = 
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      merchant.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {language === "en" ? "Pay with KETNEY" : "Payer avec KETNEY"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Shops accepting KETNEY" : "Commerces acceptant KETNEY"}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "en" ? "Search shops..." : "Rechercher..."}
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Merchant Count */}
      <div className="px-6 mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredMerchants.length} {language === "en" ? "shops found" : "commerces trouvés"}
        </p>
      </div>

      {/* Merchants List */}
      <div className="px-6 space-y-3">
        {filteredMerchants.map((merchant, index) => (
          <motion.div
            key={merchant.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="card-elevated p-4"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                {merchant.categoryIcon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{merchant.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    merchant.isOpen 
                      ? "bg-accent/10 text-accent" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {merchant.isOpen 
                      ? (language === "en" ? "Open" : "Ouvert") 
                      : (language === "en" ? "Closed" : "Fermé")
                    }
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-2 truncate">{merchant.address}</p>

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {merchant.distance}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {merchant.rating}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {merchant.hours}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMerchants.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            {language === "en" ? "No shops found" : "Aucun commerce trouvé"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "en" 
              ? "Try adjusting your search or category" 
              : "Essayez de modifier votre recherche"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Merchants;
