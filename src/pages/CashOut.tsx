import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Check, Fingerprint, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import confetti from "canvas-confetti";

type CashOutStep = "agent" | "amount" | "confirm" | "pin" | "success";

interface Agent {
  id: string;
  name: string;
  network: "Airtel" | "Orange" | "Vodacom";
  address: string;
  distance: string;
}

const agents: Agent[] = [
  { id: "1", name: "Agent Orange – Gombe", network: "Orange", address: "Avenue du Commerce, Gombe", distance: "350 m" },
  { id: "2", name: "Agent Airtel – Bandal", network: "Airtel", address: "Boulevard Lumumba, Bandal", distance: "1.2 km" },
  { id: "3", name: "Agent Vodacom – Limete", network: "Vodacom", address: "Avenue des Poids Lourds, Limete", distance: "2.5 km" },
  { id: "4", name: "Agent Orange – Matonge", network: "Orange", address: "Rue Kabinda, Matonge", distance: "3.1 km" },
];

const CashOut = () => {
  const navigate = useNavigate();
  const { balance } = useUser();
  const [step, setStep] = useState<CashOutStep>("agent");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amount.replace(/\D/g, ""));
  const fee = Math.ceil(numericAmount * 0.01); // 1% fee for cash out
  const total = numericAmount + fee;
  const isAmountValid = numericAmount >= 1000 && total <= balance;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case "Airtel": return "bg-red-500";
      case "Orange": return "bg-primary";
      case "Vodacom": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "Airtel": return "📱";
      case "Orange": return "🟠";
      case "Vodacom": return "📲";
      default: return "📍";
    }
  };

  const handleBack = () => {
    setError("");
    switch (step) {
      case "agent": navigate("/home"); break;
      case "amount": setStep("agent"); break;
      case "confirm": setStep("amount"); break;
      case "pin": setStep("confirm"); break;
      default: navigate("/home");
    }
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setStep("amount");
  };

  const handleAmountSubmit = () => {
    if (numericAmount < 1000) {
      setError("Le montant minimum est de 1 000 FC");
      return;
    }
    if (total > balance) {
      setError("Solde insuffisant pour ce retrait");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("pin");
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          setStep("success");
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }, 500);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      {step !== "success" && (
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Cash Out - Retrait</h1>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "agent" && (
          <motion.div key="agent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 px-6">
            <p className="text-muted-foreground mb-6">Choisissez un agent pour retirer :</p>
            <div className="space-y-4">
              {agents.map((agent) => (
                <button key={agent.id} onClick={() => handleAgentSelect(agent)} className="w-full card-elevated p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform text-left">
                  <div className={`w-12 h-12 rounded-2xl ${getNetworkColor(agent.network)} flex items-center justify-center text-xl`}>
                    {getNetworkIcon(agent.network)}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-foreground block">{agent.name}</span>
                    <span className="text-sm text-muted-foreground">{agent.address}</span>
                  </div>
                  <span className="flex items-center gap-1 text-primary font-medium text-sm">
                    <MapPin className="w-4 h-4" />
                    {agent.distance}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "amount" && (
          <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 px-6 flex flex-col">
            <div className="card-elevated p-4 mb-6 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${getNetworkColor(selectedAgent?.network || "")} flex items-center justify-center text-xl`}>
                {getNetworkIcon(selectedAgent?.network || "")}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{selectedAgent?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedAgent?.address}</p>
              </div>
            </div>

            <label className="text-muted-foreground mb-2">Montant à retirer</label>
            <div className="relative mb-2">
              <input
                type="text"
                inputMode="numeric"
                value={numericAmount > 0 ? formatCurrency(numericAmount) : ""}
                onChange={(e) => { setAmount(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="0"
                className="input-field text-3xl font-bold text-center pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">FC</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Minimum : 1 000 FC</span>
              <span className="text-muted-foreground">Solde : {formatCurrency(balance)} FC</span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl mb-4">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {numericAmount >= 1000 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant à retirer</span>
                  <span className="font-medium text-foreground">{formatCurrency(numericAmount)} FC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais (1%)</span>
                  <span className="font-medium text-foreground">{formatCurrency(fee)} FC</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total débité</span>
                  <span className="font-bold text-primary">{formatCurrency(total)} FC</span>
                </div>
              </motion.div>
            )}

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button onClick={handleAmountSubmit} disabled={!isAmountValid} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant
              </button>
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 px-6 flex flex-col">
            <div className="card-elevated p-6 mb-6">
              <h2 className="text-lg font-bold text-foreground mb-6 text-center">Confirmer le retrait</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Agent</span>
                  <span className="font-medium text-foreground">{selectedAgent?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Adresse</span>
                  <span className="font-medium text-foreground text-right">{selectedAgent?.address}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Montant à retirer</span>
                  <span className="font-medium text-foreground">{formatCurrency(numericAmount)} FC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Frais (1%)</span>
                  <span className="font-medium text-foreground">{formatCurrency(fee)} FC</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total débité</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(total)} FC</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary-soft rounded-2xl">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm text-foreground">Rendez-vous chez l'agent avec ce code pour retirer votre argent en espèces.</p>
            </div>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom space-y-3">
              <button onClick={handleConfirm} className="btn-primary w-full">Générer le code</button>
              <button onClick={() => navigate("/home")} className="btn-secondary w-full">Annuler</button>
            </div>
          </motion.div>
        )}

        {step === "pin" && (
          <motion.div key="pin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 px-6 flex flex-col items-center">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-soft flex items-center justify-center mb-6">
                <Fingerprint className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Entrez votre code PIN</h2>
              <p className="text-muted-foreground mb-8 text-center">Confirmez avec votre code à 4 chiffres</p>
              <div className="flex gap-4 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div key={i} initial={pin.length === i + 1 ? { scale: 1.2 } : {}} animate={{ scale: 1 }} className={`w-4 h-4 rounded-full transition-colors ${pin.length > i ? "bg-primary" : "bg-border"}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (num === "del") handlePinDelete();
                      else if (num !== null) handlePinInput(String(num));
                    }}
                    disabled={num === null}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${
                      num === null ? "invisible" : num === "del" ? "bg-secondary text-foreground" : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    {num === "del" ? "←" : num}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center px-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-accent-foreground" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Code de retrait généré !</h2>
            <p className="text-muted-foreground text-center mb-8">Rendez-vous chez {selectedAgent?.name} pour retirer {formatCurrency(numericAmount)} FC</p>
            
            <div className="card-elevated p-6 w-full max-w-xs mb-8">
              <p className="text-muted-foreground text-sm text-center mb-2">Code de retrait</p>
              <p className="text-3xl font-bold text-primary text-center tracking-widest">KTN-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
              <p className="text-xs text-muted-foreground text-center mt-2">Valide pendant 24 heures</p>
            </div>

            <button onClick={() => navigate("/home")} className="btn-primary w-full max-w-xs">
              Retour à l'accueil
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CashOut;
