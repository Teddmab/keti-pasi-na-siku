import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Fingerprint, Phone } from "lucide-react";
import OTPInput from "@/components/OTPInput";

type LoginStep = "phone" | "otp" | "biometric";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 9) {
      setStep("otp");
    }
  };

  const handleOtpComplete = (code: string) => {
    setOtp(code);
    if (code.length === 6) {
      setStep("biometric");
    }
  };

  const handleBiometricSetup = (skip: boolean) => {
    navigate("/home");
  };

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      {/* Header */}
      <div className="px-6 py-4">
        <button
          onClick={() => {
            if (step === "phone") navigate("/");
            else if (step === "otp") setStep("phone");
            else if (step === "biometric") setStep("otp");
          }}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-6"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Entrez votre numéro
              </h1>
              <p className="text-muted-foreground">
                Nous vous enverrons un code de vérification.
              </p>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-lg">🇨🇩</span>
                  <span className="text-muted-foreground font-medium">+243</span>
                </div>
                <input
                  type="tel"
                  value={formatPhoneDisplay(phoneNumber)}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="000 000 0000"
                  className="input-field pl-28 text-lg font-medium"
                  maxLength={15}
                />
              </div>
            </div>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length < 9}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Recevoir le code
              </button>
            </div>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-6"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Code reçu ?
              </h1>
              <p className="text-muted-foreground">
                Entrez le code à 6 chiffres envoyé au +243 {formatPhoneDisplay(phoneNumber)}
              </p>
            </div>

            <OTPInput length={6} onComplete={handleOtpComplete} />

            <button className="mt-6 text-primary font-medium">
              Renvoyer le code
            </button>

            <div className="flex-1" />

            <div className="pb-8 safe-bottom">
              <button
                onClick={() => setStep("biometric")}
                disabled={otp.length < 6}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Se connecter
              </button>
            </div>
          </motion.div>
        )}

        {step === "biometric" && (
          <motion.div
            key="biometric"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center px-6"
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-32 h-32 rounded-full bg-primary-soft flex items-center justify-center mb-8"
              >
                <Fingerprint className="w-16 h-16 text-primary" />
              </motion.div>

              <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
                Sécurisez votre compte
              </h1>
              <p className="text-muted-foreground text-center max-w-xs">
                Activez l'empreinte digitale ou Face ID pour sécuriser vos transactions.
              </p>
            </div>

            <div className="w-full pb-8 safe-bottom space-y-3">
              <button
                onClick={() => handleBiometricSetup(false)}
                className="btn-primary w-full"
              >
                Activer la biométrie
              </button>
              <button
                onClick={() => handleBiometricSetup(true)}
                className="btn-secondary w-full"
              >
                Peut-être plus tard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
