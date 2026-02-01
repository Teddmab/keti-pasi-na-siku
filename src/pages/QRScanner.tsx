import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, Check, Store, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useUser } from "@/context/UserContext";
import mockApi from "@/lib/mockApi";

type ScanStep = "scanning" | "amount" | "confirm" | "pin" | "success";

const QRScanner = () => {
  const navigate = useNavigate();
  const { balance, sendMoney } = useUser();
  const [step, setStep] = useState<ScanStep>("scanning");
  const [merchantInfo, setMerchantInfo] = useState({
    name: "Shoprite Gombe",
    id: "MRCH-001234",
    category: "Supermarché"
  });
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const numericAmount = Number(amount.replace(/\D/g, ""));
  const fee = Math.ceil(numericAmount * 0.005); // 0.5% merchant fee
  const total = numericAmount + fee;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const handleScanComplete = () => {
    // Simulate QR scan completion
    setTimeout(() => {
      setStep("amount");
    }, 2000);
  };

  const handleAmountSubmit = () => {
    if (numericAmount < 100) {
      toast.error("Montant minimum: 100 FC");
      return;
    }
    if (total > balance) {
      toast.error("Solde insuffisant");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("pin");
  };

  const handlePinInput = async (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        setIsProcessing(true);
        try {
          await mockApi.processMerchantPayment({
            merchantId: merchantInfo.id,
            amount: numericAmount
          });
          
          sendMoney(merchantInfo.name, merchantInfo.id, "Ketney", numericAmount, fee);
          setStep("success");
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (error) {
          toast.error("Erreur de paiement");
          setPin("");
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  // Scanning view with camera placeholder
  if (step === "scanning") {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="px-6 pt-6 pb-4 safe-top">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white">Scanner QR</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Camera Viewfinder Placeholder */}
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 border-2 border-white/30 rounded-3xl" />
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-3xl" />
            
            {/* Scanning line animation */}
            <motion.div
              className="absolute left-4 right-4 h-0.5 bg-primary"
              initial={{ top: "10%" }}
              animate={{ top: "90%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white/30" />
          </div>

          <p className="text-white text-center mb-4">
            Placez le code QR du marchand dans le cadre
          </p>
          <p className="text-white/60 text-sm text-center">
            La caméra détectera automatiquement le code
          </p>

          {/* Simulate scan button for demo */}
          <button
            onClick={handleScanComplete}
            className="mt-8 px-6 py-3 bg-primary rounded-full text-primary-foreground font-medium"
          >
            Simuler un scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => step === "amount" ? setStep("scanning") : setStep("amount")}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Paiement Marchand</h1>
      </div>

      <AnimatePresence mode="wait">
        {/* Merchant Info & Amount */}
        {step === "amount" && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 flex flex-col"
          >
            {/* Merchant Card */}
            <div className="card-elevated p-5 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                  <Store className="w-7 h-7 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-foreground">{merchantInfo.name}</h2>
                  <p className="text-sm text-muted-foreground">{merchantInfo.category}</p>
                  <p className="text-xs text-muted-foreground">ID: {merchantInfo.id}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-4 h-4 text-accent-foreground" />
                </div>
              </div>
            </div>

            <label className="text-muted-foreground mb-2">Montant à payer</label>
            <div className="relative mb-4">
              <input
                type="text"
                inputMode="numeric"
                value={numericAmount > 0 ? formatCurrency(numericAmount) : ""}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className="input-field text-3xl font-bold text-center pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                FC
              </span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Frais marchand (0.5%)</span>
              <span className="text-muted-foreground">{formatCurrency(fee)} FC</span>
            </div>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button
                onClick={handleAmountSubmit}
                disabled={numericAmount < 100 || total > balance}
                className="btn-primary w-full disabled:opacity-50"
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
                Confirmer le paiement
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Marchand</span>
                  <span className="font-medium text-foreground">{merchantInfo.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-medium text-foreground">{formatCurrency(numericAmount)} FC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Frais</span>
                  <span className="font-medium text-foreground">{formatCurrency(fee)} FC</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(total)} FC</span>
                </div>
              </div>
            </div>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom space-y-3">
              <button onClick={handleConfirm} className="btn-primary w-full">
                Payer maintenant
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
            className="flex-1 px-6 flex flex-col items-center justify-center"
          >
            {isProcessing ? (
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                <p className="text-foreground font-medium">Traitement en cours...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Entrez votre code PIN
                </h2>
                <p className="text-muted-foreground mb-8 text-center">
                  Confirmez le paiement de {formatCurrency(total)} FC
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

                <div className="grid grid-cols-3 gap-3">
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
              </>
            )}
          </motion.div>
        )}

        {/* Success */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 px-6 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6"
            >
              <Check className="w-12 h-12 text-accent-foreground" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">Paiement réussi!</h2>
            <p className="text-muted-foreground text-center mb-8">
              Vous avez payé {formatCurrency(numericAmount)} FC à {merchantInfo.name}
            </p>

            <button
              onClick={() => navigate("/home")}
              className="btn-primary px-12"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRScanner;
