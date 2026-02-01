import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, QrCode, Check, Fingerprint, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SendStep = "network" | "recipient" | "amount" | "confirm" | "pin" | "success";

interface Network {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const networks: Network[] = [
  { id: "airtel", name: "Airtel Money", icon: "📱", color: "bg-red-500" },
  { id: "orange", name: "Orange Money", icon: "🟠", color: "bg-primary" },
  { id: "vodacom", name: "Vodacom M-Pesa", icon: "📲", color: "bg-blue-500" },
];

const Send = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SendStep>("network");
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const fee = Math.ceil(Number(amount) * 0.01);
  const total = Number(amount) + fee;

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
    if (recipient.length >= 9) {
      setStep("amount");
    }
  };

  const handleAmountSubmit = () => {
    if (Number(amount) >= 500) {
      setStep("confirm");
    }
  };

  const handleConfirm = () => {
    setStep("pin");
  };

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      setStep("success");
    }
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
                  <span className="text-lg font-semibold text-foreground">{network.name}</span>
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
              <span className="font-medium text-foreground">{selectedNetwork?.name}</span>
            </div>

            <label className="text-muted-foreground mb-2">Numéro du destinataire</label>
            <div className="relative mb-4">
              <input
                type="tel"
                value={formatPhoneDisplay(recipient)}
                onChange={(e) => setRecipient(e.target.value.replace(/\D/g, ""))}
                placeholder="000 000 0000"
                className="input-field text-lg font-medium pr-12"
                maxLength={15}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <QrCode className="w-6 h-6 text-primary" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              Entrez ou scannez un QR code
            </p>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button
                onClick={handleRecipientSubmit}
                disabled={recipient.length < 9}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
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
            <label className="text-muted-foreground mb-2">Montant à envoyer</label>
            <div className="relative mb-2">
              <input
                type="text"
                inputMode="numeric"
                value={amount ? formatCurrency(Number(amount)) : ""}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className="input-field text-3xl font-bold text-center pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                CDF
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Minimum : 500 CDF
            </p>

            {Number(amount) >= 500 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elevated p-4 space-y-3"
              >
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais (1%)</span>
                  <span className="font-medium text-foreground">{formatCurrency(fee)} CDF</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total à payer</span>
                  <span className="font-bold text-primary">{formatCurrency(total)} CDF</span>
                </div>
              </motion.div>
            )}

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button
                onClick={handleAmountSubmit}
                disabled={Number(amount) < 500}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
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
                  <span className="font-medium text-foreground">+243 {formatPhoneDisplay(recipient)}</span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-medium text-foreground">{formatCurrency(Number(amount))} CDF</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Frais</span>
                  <span className="font-medium text-foreground">{formatCurrency(fee)} CDF</span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(total)} CDF</span>
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

            <div className="pb-8 safe-bottom">
              <button onClick={handleConfirm} className="btn-primary w-full">
                Confirmer l'envoi
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
              <p className="text-muted-foreground mb-8">
                Ou utilisez l'empreinte digitale
              </p>

              <div className="flex gap-4 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
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
                        setPin(pin.slice(0, -1));
                      } else if (num !== null && pin.length < 4) {
                        const newPin = pin + num;
                        setPin(newPin);
                        if (newPin.length === 4) {
                          setTimeout(() => setStep("success"), 300);
                        }
                      }
                    }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold transition-colors ${
                      num === null ? "invisible" : "bg-secondary hover:bg-muted active:bg-primary active:text-primary-foreground"
                    }`}
                  >
                    {num === "del" ? "⌫" : num}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Success */}
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
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6"
            >
              <Check className="w-12 h-12 text-accent-foreground" />
            </motion.div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Transfert réussi !
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Vous avez envoyé {formatCurrency(Number(amount))} CDF à +243 {formatPhoneDisplay(recipient)}
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={() => navigate("/home")}
                className="btn-primary w-full"
              >
                Retour à l'accueil
              </button>
              <button className="btn-secondary w-full">
                Télécharger le reçu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Send;
