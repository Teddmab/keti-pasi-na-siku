import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Check, 
  Fingerprint, 
  AlertCircle,
  CreditCard,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import confetti from "canvas-confetti";

type CashInMethod = "select" | "mobile-money" | "card";
type CashInStep = "method" | "amount" | "confirm" | "pin" | "success";

interface MobileMoneyProvider {
  id: string;
  name: string;
  network: "Airtel" | "Orange" | "Vodacom";
  icon: string;
}

const mobileMoneyProviders: MobileMoneyProvider[] = [
  { id: "orange", name: "Orange Money", network: "Orange", icon: "🟠" },
  { id: "airtel", name: "Airtel Money", network: "Airtel", icon: "📱" },
  { id: "mpesa", name: "M-Pesa", network: "Vodacom", icon: "📲" },
];

const CashIn = () => {
  const navigate = useNavigate();
  const { balance } = useUser();
  const { t, language } = useLanguage();
  const [step, setStep] = useState<CashInStep>("method");
  const [method, setMethod] = useState<CashInMethod>("select");
  const [selectedProvider, setSelectedProvider] = useState<MobileMoneyProvider | null>(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const numericAmount = Number(amount.replace(/\D/g, ""));
  const isAmountValid = numericAmount >= 1000;

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

  const handleBack = () => {
    setError("");
    switch (step) {
      case "method": navigate("/home"); break;
      case "amount": setStep("method"); setMethod("select"); break;
      case "confirm": setStep("amount"); break;
      case "pin": setStep("confirm"); break;
      default: navigate("/home");
    }
  };

  const handleMethodSelect = (selectedMethod: CashInMethod) => {
    if (selectedMethod === "select") {
      // Navigate to agents page
      navigate("/agents");
    } else {
      setMethod(selectedMethod);
      setStep("amount");
    }
  };

  const handleProviderSelect = (provider: MobileMoneyProvider) => {
    setSelectedProvider(provider);
  };

  const handleAmountSubmit = () => {
    if (!isAmountValid) {
      setError(language === "en" ? "Minimum amount is 1,000 FC" : "Le montant minimum est de 1 000 FC");
      return;
    }
    if (method === "mobile-money" && !selectedProvider) {
      setError(language === "en" ? "Please select a provider" : "Veuillez sélectionner un opérateur");
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

  const getMethodLabel = () => {
    if (method === "card") return language === "en" ? "Debit Card" : "Carte bancaire";
    if (method === "mobile-money") return selectedProvider?.name || "Mobile Money";
    return "";
  };

  const getFees = () => {
    if (method === "card") return Math.round(numericAmount * 0.025); // 2.5% fee
    return 0; // Free for mobile money
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      {step !== "success" && (
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            {language === "en" ? "Cash In - Deposit" : "Cash In - Dépôt"}
          </h1>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "method" && (
          <motion.div 
            key="method" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="flex-1 px-6"
          >
            <p className="text-muted-foreground mb-6">
              {language === "en" ? "How would you like to deposit money?" : "Comment souhaitez-vous déposer de l'argent ?"}
            </p>
            
            <div className="space-y-4">
              {/* Agent Option */}
              <button 
                onClick={() => handleMethodSelect("select")}
                className="w-full card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-foreground block text-base">
                    {language === "en" ? "Cash Agent" : "Agent Cash"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {language === "en" ? "Find an agent near you" : "Trouvez un agent près de chez vous"}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Mobile Money Option */}
              <button 
                onClick={() => handleMethodSelect("mobile-money")}
                className="w-full card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-foreground block text-base">Mobile Money</span>
                  <span className="text-sm text-muted-foreground">
                    {language === "en" ? "Orange, Airtel, M-Pesa" : "Orange, Airtel, M-Pesa"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-accent font-medium px-2 py-1 bg-accent/10 rounded-full">
                    {language === "en" ? "Free" : "Gratuit"}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>

              {/* Debit Card Option */}
              <button 
                onClick={() => handleMethodSelect("card")}
                className="w-full card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-blue-500" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-foreground block text-base">
                    {language === "en" ? "Debit Card" : "Carte bancaire"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {language === "en" ? "Visa, Mastercard" : "Visa, Mastercard"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-secondary rounded-full">
                    2.5%
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {step === "amount" && (
          <motion.div 
            key="amount" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="flex-1 px-6 flex flex-col"
          >
            {/* Mobile Money Provider Selection */}
            {method === "mobile-money" && (
              <div className="mb-6">
                <label className="text-muted-foreground mb-3 block">
                  {language === "en" ? "Select your provider" : "Choisissez votre opérateur"}
                </label>
                <div className="flex gap-3">
                  {mobileMoneyProviders.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSelect(provider)}
                      className={`flex-1 p-3 rounded-2xl border-2 transition-all ${
                        selectedProvider?.id === provider.id 
                          ? "border-primary bg-primary/10" 
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${getNetworkColor(provider.network)} flex items-center justify-center text-lg mx-auto mb-2`}>
                        {provider.icon}
                      </div>
                      <span className="text-xs font-medium text-foreground block text-center">{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Card Info */}
            {method === "card" && (
              <div className="card-elevated p-4 mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {language === "en" ? "Debit Card Deposit" : "Dépôt par carte"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "2.5% processing fee" : "Frais de 2.5%"}
                  </p>
                </div>
              </div>
            )}

            <label className="text-muted-foreground mb-2">
              {language === "en" ? "Amount to deposit" : "Montant à déposer"}
            </label>
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
              <span className="text-muted-foreground">
                {language === "en" ? "Minimum: 1,000 FC" : "Minimum : 1 000 FC"}
              </span>
              <span className={method === "card" ? "text-muted-foreground" : "text-accent font-medium"}>
                {method === "card" 
                  ? (language === "en" ? "Fee: 2.5%" : "Frais : 2.5%")
                  : (language === "en" ? "No fees" : "Sans frais")
                }
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl mb-4">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button 
                onClick={handleAmountSubmit} 
                disabled={!isAmountValid || (method === "mobile-money" && !selectedProvider)} 
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === "en" ? "Next" : "Suivant"}
              </button>
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div 
            key="confirm" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="flex-1 px-6 flex flex-col"
          >
            <div className="card-elevated p-6 mb-6">
              <h2 className="text-lg font-bold text-foreground mb-6 text-center">
                {language === "en" ? "Confirm deposit" : "Confirmer le dépôt"}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Method" : "Méthode"}
                  </span>
                  <span className="font-medium text-foreground">{getMethodLabel()}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Amount" : "Montant"}
                  </span>
                  <span className="font-medium text-foreground">{formatCurrency(numericAmount)} FC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Fees" : "Frais"}
                  </span>
                  <span className={`font-medium ${getFees() > 0 ? "text-foreground" : "text-accent"}`}>
                    {getFees() > 0 ? `${formatCurrency(getFees())} FC` : (language === "en" ? "Free ✨" : "Gratuit ✨")}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {language === "en" ? "You will receive" : "Vous recevrez"}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(numericAmount - getFees())} FC
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom space-y-3">
              <button onClick={handleConfirm} className="btn-primary w-full">
                {language === "en" ? "Confirm" : "Confirmer"}
              </button>
              <button onClick={() => navigate("/home")} className="btn-secondary w-full">
                {language === "en" ? "Cancel" : "Annuler"}
              </button>
            </div>
          </motion.div>
        )}

        {step === "pin" && (
          <motion.div 
            key="pin" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="flex-1 px-6 flex flex-col items-center"
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-soft flex items-center justify-center mb-6">
                <Fingerprint className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {language === "en" ? "Enter your PIN" : "Entrez votre code PIN"}
              </h2>
              <p className="text-muted-foreground mb-8 text-center">
                {language === "en" ? "Confirm with your 4-digit code" : "Confirmez avec votre code à 4 chiffres"}
              </p>
              <div className="flex gap-4 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    initial={pin.length === i + 1 ? { scale: 1.2 } : {}} 
                    animate={{ scale: 1 }} 
                    className={`w-4 h-4 rounded-full transition-colors ${pin.length > i ? "bg-primary" : "bg-border"}`} 
                  />
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
          <motion.div 
            key="success" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", delay: 0.2 }} 
              className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6"
            >
              <Check className="w-12 h-12 text-accent-foreground" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {language === "en" ? "Deposit successful!" : "Dépôt réussi !"}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {formatCurrency(numericAmount - getFees())} FC {language === "en" ? "added to your account" : "ajoutés à votre compte"}
            </p>
            
            <div className="card-elevated p-6 w-full max-w-xs mb-8">
              <p className="text-muted-foreground text-sm text-center mb-2">
                {language === "en" ? "Transaction ID" : "Référence"}
              </p>
              <p className="text-lg font-bold text-primary text-center tracking-widest">
                KTN-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>
            </div>

            <button onClick={() => navigate("/home")} className="btn-primary w-full max-w-xs">
              {language === "en" ? "Back to home" : "Retour à l'accueil"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CashIn;
