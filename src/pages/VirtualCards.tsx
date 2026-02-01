import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, CreditCard, Eye, EyeOff, Copy, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import mockApi from "@/lib/mockApi";

interface VirtualCard {
  id: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardHolder: string;
  balance: number;
  type: "visa" | "mastercard";
  isActive: boolean;
}

const VirtualCards = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<VirtualCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const maskCardNumber = (number: string) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const handleGenerateCard = async () => {
    setIsGenerating(true);
    try {
      const response = await mockApi.generateVirtualCard();
      if (response.success) {
        const newCard: VirtualCard = {
          id: `card_${Date.now()}`,
          ...response.data,
          balance: 0,
          type: Math.random() > 0.5 ? "visa" : "mastercard",
          isActive: true
        };
        setCards(prev => [...prev, newCard]);
        setSelectedCard(newCard);
        toast.success("Carte virtuelle générée avec succès!");
      }
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copié dans le presse-papiers");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 safe-top">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Mes Cartes Virtuelles</h1>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-soft rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Cartes pour achats en ligne</p>
              <p className="text-sm text-muted-foreground">
                Générez des cartes virtuelles VISA/Mastercard sécurisées pour vos achats sur internet.
                Conforme aux normes PCI-DSS.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="px-6 space-y-4">
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Aucune carte virtuelle</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Créez votre première carte pour effectuer des achats en ligne
            </p>
          </div>
        ) : (
          cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="perspective-1000"
            >
              <motion.div
                className="relative w-full h-48 cursor-pointer"
                onClick={() => {
                  setSelectedCard(card);
                  setIsFlipped(!isFlipped);
                }}
                animate={{ rotateY: selectedCard?.id === card.id && isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of Card */}
                <div
                  className={`absolute inset-0 rounded-2xl p-6 ${
                    card.type === "visa" 
                      ? "bg-gradient-to-br from-primary via-primary to-primary/80" 
                      : "bg-gradient-to-br from-accent via-accent to-accent/80"
                  } text-white shadow-lg`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-xs opacity-80">Carte Virtuelle</div>
                    <div className="text-xl font-bold">
                      {card.type === "visa" ? "VISA" : "Mastercard"}
                    </div>
                  </div>
                  <div className="text-xl font-mono tracking-wider mb-6">
                    {maskCardNumber(card.cardNumber)}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-80">Titulaire</div>
                      <div className="font-medium">{card.cardHolder}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-80">Expire</div>
                      <div className="font-medium">{card.expiryDate}</div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-6 text-xs opacity-60">
                    Tapez pour retourner
                  </div>
                </div>

                {/* Back of Card */}
                <div
                  className={`absolute inset-0 rounded-2xl p-6 ${
                    card.type === "visa" 
                      ? "bg-gradient-to-br from-primary/90 via-primary to-primary/70" 
                      : "bg-gradient-to-br from-accent/90 via-accent to-accent/70"
                  } text-white shadow-lg`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="h-10 bg-black/40 -mx-6 mt-2 mb-6" />
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs opacity-80 mb-1">Numéro de carte</div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{formatCardNumber(card.cardNumber)}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(card.cardNumber, "number");
                          }}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          {copiedField === "number" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div>
                        <div className="text-xs opacity-80 mb-1">CVV</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{showCVV ? card.cvv : "•••"}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCVV(!showCVV);
                            }}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(card.cvv, "cvv");
                            }}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            {copiedField === "cvv" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80 mb-1">Expiration</div>
                        <span className="font-mono">{card.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))
        )}

        {/* Generate Card Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleGenerateCard}
          disabled={isGenerating}
          className="w-full card-elevated p-5 flex items-center justify-center gap-3 hover:bg-secondary/50 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="font-medium text-foreground">Génération en cours...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium text-foreground">Générer une nouvelle carte</span>
            </>
          )}
        </motion.button>

        {/* Card Usage Info */}
        <div className="card-elevated p-4 mt-6">
          <h3 className="font-semibold text-foreground mb-3">Comment utiliser votre carte</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>Rechargez votre carte depuis votre solde KETNEY</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>Utilisez les détails de carte pour vos achats en ligne</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>Acceptée sur tous les sites VISA/Mastercard</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VirtualCards;
