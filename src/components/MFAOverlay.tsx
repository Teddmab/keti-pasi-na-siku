import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Fingerprint, 
  X, 
  Check, 
  Loader2,
  AlertCircle
} from "lucide-react";
import mockApi from "@/lib/mockApi";

interface MFAOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  transactionType: string;
}

const MFAOverlay = ({ isOpen, onClose, onSuccess, amount, transactionType }: MFAOverlayProps) => {
  const [step, setStep] = useState<"pin" | "biometric" | "verifying" | "success">("pin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError("");
      
      if (newPin.length === 4) {
        // Move to biometric step
        setTimeout(() => setStep("biometric"), 300);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  const handleBiometricConfirm = async () => {
    setStep("verifying");
    
    try {
      const response = await mockApi.verifyMFA(pin, true);
      if (response.success && response.data.verified) {
        setStep("success");
        setTimeout(() => {
          onSuccess();
          resetState();
        }, 1500);
      } else {
        setError("Vérification échouée. Réessayez.");
        setStep("pin");
        setPin("");
      }
    } catch (error) {
      setError("Erreur de vérification");
      setStep("pin");
      setPin("");
    }
  };

  const resetState = () => {
    setStep("pin");
    setPin("");
    setError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Sécurité renforcée</h2>
                <p className="text-xs text-muted-foreground">Authentification MFA requise</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>

          {/* Transaction Info */}
          <div className="bg-destructive/10 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Transaction de haute valeur</span>
            </div>
            <p className="text-sm text-foreground">
              {transactionType} de <span className="font-bold">{formatCurrency(amount)} FC</span>
            </p>
          </div>

          {/* PIN Step */}
          {step === "pin" && (
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-6 text-center">
                Étape 1/2: Entrez votre code PIN
              </p>

              {error && (
                <div className="mb-4 px-4 py-2 bg-destructive/10 text-destructive text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mb-6">
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

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (num === "del") handlePinDelete();
                      else if (num !== null) handlePinInput(String(num));
                    }}
                    disabled={num === null}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                      num === null ? "invisible" : num === "del" ? "bg-secondary text-foreground" : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    {num === "del" ? "←" : num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Biometric Step */}
          {step === "biometric" && (
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-6 text-center">
                Étape 2/2: Confirmation biométrique
              </p>

              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBiometricConfirm}
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 hover:bg-primary/20 transition-colors"
              >
                <Fingerprint className="w-12 h-12 text-primary" />
              </motion.button>

              <p className="text-sm text-muted-foreground text-center">
                Touchez pour simuler Face ID / Touch ID
              </p>
            </div>
          )}

          {/* Verifying Step */}
          {step === "verifying" && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-foreground font-medium">Vérification en cours...</p>
              <p className="text-sm text-muted-foreground">Conformité AML/KYC</p>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="flex flex-col items-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4"
              >
                <Check className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <p className="text-foreground font-medium">Authentification réussie</p>
              <p className="text-sm text-muted-foreground">Transaction autorisée</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MFAOverlay;
