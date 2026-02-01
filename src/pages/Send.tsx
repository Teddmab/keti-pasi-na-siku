import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, QrCode, Check, Fingerprint, AlertCircle, X, Users, Info } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser, Transaction } from "@/context/UserContext";
import ContactPicker from "@/components/ContactPicker";
import MFAOverlay from "@/components/MFAOverlay";
import confetti from "canvas-confetti";

type SendStep = "network" | "recipient" | "amount" | "confirm" | "pin" | "success";

interface Network {
  id: string;
  name: string;
  icon: string;
  color: string;
  feePercent: number;
  clearingFee: number; // Inter-network clearing fee
  isInterNetwork: boolean;
}

const networks: Network[] = [
  { id: "airtel", name: "Airtel Money", icon: "📱", color: "bg-red-500", feePercent: 1, clearingFee: 0.5, isInterNetwork: true },
  { id: "orange", name: "Orange Money", icon: "🟠", color: "bg-primary", feePercent: 1, clearingFee: 0.5, isInterNetwork: true },
  { id: "vodacom", name: "Vodacom M-Pesa", icon: "📲", color: "bg-blue-500", feePercent: 1, clearingFee: 0.5, isInterNetwork: true },
  { id: "ketney", name: "Ketney à Ketney", icon: "💚", color: "bg-accent", feePercent: 0, clearingFee: 0, isInterNetwork: false },
];

// High-value threshold for MFA
const MFA_THRESHOLD = 100000;

const Send = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { balance, sendMoney } = useUser();
  const [step, setStep] = useState<SendStep>("network");
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState("");
  const [contactPickerOpen, setContactPickerOpen] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);

  // Pre-fill from URL params (when clicking frequent contacts)
  useEffect(() => {
    const phone = searchParams.get("phone");
    const name = searchParams.get("name");
    if (phone && name) {
      setRecipient(phone);
      setRecipientName(name);
      // Auto-select Ketney network for pre-filled contacts
      setSelectedNetwork(networks.find(n => n.id === "ketney") || null);
      setStep("amount");
    }
  }, [searchParams]);

  const numericAmount = Number(amount.replace(/\D/g, ""));
  const baseFee = selectedNetwork ? Math.ceil(numericAmount * (selectedNetwork.feePercent / 100)) : 0;
  const clearingFee = selectedNetwork?.isInterNetwork ? Math.ceil(numericAmount * (selectedNetwork.clearingFee / 100)) : 0;
  const fee = baseFee + clearingFee;
  const total = numericAmount + fee;

  const isHighValue = numericAmount >= MFA_THRESHOLD;

  const isPhoneValid = recipient.replace(/\D/g, "").length >= 10;
  const isAmountValid = numericAmount >= 500 && total <= balance;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const handleBack = () => {
    setError("");
    switch (step) {
      case "network":
        navigate("/home");
        break;
      case "recipient":
        setStep("network");
        break;
      case "amount":
        setStep("recipient");
        break;
      case "confirm":
        setStep("amount");
        break;
      case "pin":
        setStep("confirm");
        break;
      default:
        navigate("/home");
    }
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setStep("recipient");
  };

  const handleRecipientSubmit = () => {
    if (isPhoneValid) {
      // Mock name lookup
      const names = ["Sarah Mbuyi", "Jean Kabongo", "Marie Lukusa", "Patrick Mutombo", "Thérèse Kasongo"];
      setRecipientName(names[Math.floor(Math.random() * names.length)]);
      setStep("amount");
    }
  };

  const handleAmountSubmit = () => {
    if (!isAmountValid) {
      if (numericAmount < 500) {
        setError("Le montant minimum est de 500 FC");
      } else if (total > balance) {
        setError("Solde insuffisant pour cette transaction");
      }
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleConfirm = () => {
    if (isHighValue) {
      setMfaOpen(true);
    } else {
      setStep("pin");
    }
  };

  const handleMFASuccess = () => {
    setMfaOpen(false);
    setStep("pin");
  };

  const handleContactSelect = (contact: { name: string; phone: string }) => {
    setRecipient(contact.phone);
    setRecipientName(contact.name);
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // Process transaction
        setTimeout(() => {
          const transaction = sendMoney(
            recipientName,
            recipient.replace(/\D/g, ""),
            selectedNetwork!.name.includes("Airtel") ? "Airtel" :
            selectedNetwork!.name.includes("Orange") ? "Orange" :
            selectedNetwork!.name.includes("Vodacom") ? "Vodacom" : "Ketney",
            numericAmount,
            fee
          );
          setLastTransaction(transaction);
          setStep("success");
          
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      {/* Header */}
      {step !== "success" && (
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Envoyer de l'argent</h1>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Network Selection */}
        {step === "network" && (
          <motion.div
            key="network"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6"
          >
            <p className="text-muted-foreground mb-6">Choisissez un réseau :</p>
            
            <div className="space-y-4">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSelect(network)}
                  className="w-full card-elevated p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                >
                  <div className={`w-14 h-14 rounded-2xl ${network.color} flex items-center justify-center text-2xl`}>
                    {network.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-lg font-semibold text-foreground block">{network.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {network.feePercent === 0 ? "Sans frais ✨" : `Frais: ${network.feePercent}%`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recipient */}
        {step === "recipient" && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6 p-4 bg-secondary rounded-2xl">
              <div className={`w-10 h-10 rounded-xl ${selectedNetwork?.color} flex items-center justify-center text-lg`}>
                {selectedNetwork?.icon}
              </div>
              <div className="flex-1">
                <span className="font-medium text-foreground">{selectedNetwork?.name}</span>
                <span className="text-sm text-muted-foreground block">
                  {selectedNetwork?.feePercent === 0 ? "Sans frais" : `${selectedNetwork?.feePercent}% de frais`}
                </span>
              </div>
            </div>

            <label className="text-muted-foreground mb-2">Numéro du destinataire</label>
            <div className="relative mb-2">
              <input
                type="tel"
                value={formatPhoneDisplay(recipient)}
                onChange={(e) => {
                  setRecipient(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="089 000 0000"
                className="input-field text-lg font-medium pr-24"
                maxLength={15}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button 
                  onClick={() => setContactPickerOpen(true)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <Users className="w-5 h-5 text-primary" />
                </button>
                <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                  <QrCode className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Utilisez le répertoire ou scannez un QR code
            </p>

            {!isPhoneValid && recipient.length > 0 && (
              <p className="text-sm text-destructive mb-4">
                Le numéro doit contenir 10 chiffres
              </p>
            )}

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button
                onClick={handleRecipientSubmit}
                disabled={!isPhoneValid}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </motion.div>
        )}

        {/* Amount */}
        {step === "amount" && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 flex flex-col"
          >
            {/* Recipient info */}
            <div className="card-elevated p-4 mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {recipientName.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{recipientName}</p>
                <p className="text-sm text-muted-foreground">+243 {formatPhoneDisplay(recipient)}</p>
              </div>
            </div>

            <label className="text-muted-foreground mb-2">Montant à envoyer</label>
            <div className="relative mb-2">
              <input
                type="text"
                inputMode="numeric"
                value={numericAmount > 0 ? formatCurrency(numericAmount) : ""}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="0"
                className="input-field text-3xl font-bold text-center pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                FC
              </span>
            </div>
            
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Minimum : 500 FC</span>
              <span className="text-muted-foreground">Solde : {formatCurrency(balance)} FC</span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl mb-4">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {numericAmount >= 500 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elevated p-4 space-y-3"
              >
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-medium text-foreground">{formatCurrency(numericAmount)} FC</span>
                </div>
                
                {/* Detailed fee breakdown for inter-network */}
                {selectedNetwork?.isInterNetwork ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Frais de transfert ({selectedNetwork?.feePercent}%)
                      </span>
                      <span className="font-medium text-foreground">{formatCurrency(baseFee)} FC</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Frais de compensation inter-réseaux</span>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{formatCurrency(clearingFee)} FC</span>
                    </div>
                    <div className="bg-primary-soft rounded-lg p-2 flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground">
                        Transfert Inter-réseaux: Inclut les frais de clearing pour la compensation entre KETNEY et {selectedNetwork?.name}.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Frais ({selectedNetwork?.feePercent}%)
                    </span>
                    <span className="font-medium text-accent">Gratuit ✨</span>
                  </div>
                )}
                
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total à payer</span>
                  <span className="font-bold text-primary">{formatCurrency(total)} FC</span>
                </div>
                
                {isHighValue && (
                  <div className="bg-destructive/10 rounded-lg p-2 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-destructive">
                      Transaction de haute valeur: Authentification MFA requise (Conformité AML/KYC)
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button
                onClick={handleAmountSubmit}
                disabled={!isAmountValid}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </motion.div>
        )}

        {/* Confirm */}
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
                Confirmer le transfert
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Réseau</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedNetwork?.icon}</span>
                    <span className="font-medium text-foreground">{selectedNetwork?.name}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Destinataire</span>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{recipientName}</p>
                    <p className="text-sm text-muted-foreground">+243 {formatPhoneDisplay(recipient)}</p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-medium text-foreground">{formatCurrency(numericAmount)} FC</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Frais</span>
                  <span className={`font-medium ${fee === 0 ? "text-accent" : "text-foreground"}`}>
                    {fee === 0 ? "Gratuit ✨" : `${formatCurrency(fee)} FC`}
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(total)} FC</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary-soft rounded-2xl">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm text-foreground">
                Vérifiez bien les informations avant de confirmer. Cette opération est irréversible.
              </p>
            </div>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom space-y-3">
              <button onClick={handleConfirm} className="btn-primary w-full">
                Confirmer l'envoi
              </button>
              <button onClick={() => navigate("/home")} className="btn-secondary w-full">
                Annuler
              </button>
            </div>
          </motion.div>
        )}

        {/* PIN */}
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
                Entrez votre code PIN
              </h2>
              <p className="text-muted-foreground mb-8 text-center">
                Confirmez avec votre code à 4 chiffres
              </p>

              <div className="flex gap-4 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={pin.length === i + 1 ? { scale: 1.2 } : {}}
                    animate={{ scale: 1 }}
                    className={`w-4 h-4 rounded-full transition-colors ${
                      pin.length > i ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (num === "del") {
                        handlePinDelete();
                      } else if (num !== null) {
                        handlePinInput(String(num));
                      }
                    }}
                    disabled={pin.length === 4}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold transition-colors ${
                      num === null 
                        ? "invisible" 
                        : "bg-secondary hover:bg-muted active:bg-primary active:text-primary-foreground disabled:opacity-50"
                    }`}
                  >
                    {num === "del" ? "⌫" : num}
                  </button>
                ))}
              </div>
            </div>

            <div className="pb-8 safe-bottom w-full">
              <button onClick={() => navigate("/home")} className="btn-secondary w-full">
                Annuler
              </button>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {step === "success" && lastTransaction && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6"
            >
              <Check className="w-12 h-12 text-accent-foreground" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Transfert réussi ! 🎉
              </h1>
              <p className="text-muted-foreground mb-2">
                Vous avez envoyé
              </p>
              <p className="text-3xl font-extrabold text-primary mb-2">
                {formatCurrency(lastTransaction.amount)} FC
              </p>
              <p className="text-muted-foreground">
                à {lastTransaction.recipient}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="card-elevated p-4 mt-8 w-full"
            >
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Référence</span>
                <span className="font-mono text-sm font-medium text-foreground">
                  {lastTransaction.transactionRef}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full mt-8 space-y-3"
            >
              <button
                onClick={() => navigate("/home")}
                className="btn-primary w-full"
              >
                Retour à l'accueil
              </button>
              <button className="btn-secondary w-full">
                Télécharger le reçu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Picker */}
      <ContactPicker
        isOpen={contactPickerOpen}
        onClose={() => setContactPickerOpen(false)}
        onSelect={handleContactSelect}
      />

      {/* MFA Overlay for high-value transactions */}
      <MFAOverlay
        isOpen={mfaOpen}
        onClose={() => setMfaOpen(false)}
        onSuccess={handleMFASuccess}
        amount={numericAmount}
        transactionType="Transfert"
      />
    </div>
  );
};

export default Send;
