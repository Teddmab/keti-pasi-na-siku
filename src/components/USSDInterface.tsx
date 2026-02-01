import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUSSDMode } from "@/context/USSDModeContext";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

type USSDScreen = 
  | "main" 
  | "send" 
  | "send_amount" 
  | "send_confirm" 
  | "send_pin"
  | "send_success"
  | "balance" 
  | "history" 
  | "cashin" 
  | "cashout"
  | "cashout_amount"
  | "cashout_confirm"
  | "cashout_pin"
  | "cashout_success";

const USSDInterface = () => {
  const { toggleUSSDMode } = useUSSDMode();
  const { balance, transactions } = useUser();
  const [screen, setScreen] = useState<USSDScreen>("main");
  const [inputValue, setInputValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [pin, setPin] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CD").format(value);
  };

  const handleKeyPress = (key: string) => {
    if (key === "C") {
      setInputValue("");
    } else if (key === "#") {
      handleSubmit();
    } else if (key === "*") {
      handleBack();
    } else {
      setInputValue(prev => prev + key);
    }
  };

  const handleBack = () => {
    setInputValue("");
    if (screen === "send_amount") setScreen("send");
    else if (screen === "send_confirm") setScreen("send_amount");
    else if (screen === "send_pin") setScreen("send_confirm");
    else if (screen === "cashout_amount") setScreen("cashout");
    else if (screen === "cashout_confirm") setScreen("cashout_amount");
    else if (screen === "cashout_pin") setScreen("cashout_confirm");
    else setScreen("main");
  };

  const handleSubmit = () => {
    const value = inputValue.trim();
    setInputValue("");

    switch (screen) {
      case "main":
        if (value === "1") setScreen("send");
        else if (value === "2") setScreen("balance");
        else if (value === "3") setScreen("history");
        else if (value === "4") setScreen("cashin");
        else if (value === "5") setScreen("cashout");
        else if (value === "0") toggleUSSDMode();
        break;
      
      case "send":
        if (value.length >= 9) {
          setPhoneNumber(value);
          setScreen("send_amount");
        }
        break;
      
      case "send_amount":
        const sendAmt = parseInt(value);
        if (sendAmt > 0 && sendAmt <= balance) {
          setAmount(sendAmt);
          setScreen("send_confirm");
        }
        break;
      
      case "send_confirm":
        if (value === "1") setScreen("send_pin");
        else if (value === "2") setScreen("main");
        break;
      
      case "send_pin":
        if (value.length === 4) {
          setPin(value);
          setScreen("send_success");
          setTimeout(() => {
            toast.success("Transaction réussie!");
          }, 500);
        }
        break;
      
      case "send_success":
        setScreen("main");
        setPhoneNumber("");
        setAmount(0);
        setPin("");
        break;

      case "balance":
        setScreen("main");
        break;

      case "history":
        setScreen("main");
        break;

      case "cashin":
        if (value === "1" || value === "2" || value === "3") {
          toast.success("Rendez-vous chez l'agent le plus proche");
          setScreen("main");
        } else if (value === "0") {
          setScreen("main");
        }
        break;

      case "cashout":
        if (value.length >= 6) {
          setPhoneNumber(value); // Agent code
          setScreen("cashout_amount");
        }
        break;

      case "cashout_amount":
        const cashoutAmt = parseInt(value);
        if (cashoutAmt > 0 && cashoutAmt <= balance) {
          setAmount(cashoutAmt);
          setScreen("cashout_confirm");
        }
        break;

      case "cashout_confirm":
        if (value === "1") setScreen("cashout_pin");
        else if (value === "2") setScreen("main");
        break;

      case "cashout_pin":
        if (value.length === 4) {
          setPin(value);
          setScreen("cashout_success");
          setTimeout(() => {
            toast.success("Retrait autorisé!");
          }, 500);
        }
        break;

      case "cashout_success":
        setScreen("main");
        setPhoneNumber("");
        setAmount(0);
        setPin("");
        break;
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "main":
        return (
          <div className="space-y-1">
            <p className="border-b border-green-400 pb-2 mb-3">MENU PRINCIPAL</p>
            <p>1. Envoyer de l'argent</p>
            <p>2. Consulter le solde</p>
            <p>3. Historique</p>
            <p>4. Cash In</p>
            <p>5. Cash Out</p>
            <p className="mt-4 pt-2 border-t border-green-400/50">0. Quitter mode USSD</p>
          </div>
        );

      case "send":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">ENVOYER DE L'ARGENT</p>
            <p className="mt-4">Entrez le numéro du bénéficiaire:</p>
            <p className="text-xs opacity-60">(Format: 089XXXXXXX)</p>
            <div className="mt-4 p-2 border border-green-400/50 min-h-[32px]">
              {inputValue || "_"}
            </div>
          </div>
        );

      case "send_amount":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">MONTANT À ENVOYER</p>
            <p className="text-sm opacity-80">Vers: +243 {phoneNumber}</p>
            <p className="text-sm opacity-60">Solde: {formatCurrency(balance)} FC</p>
            <p className="mt-4">Entrez le montant (FC):</p>
            <div className="mt-2 p-2 border border-green-400/50 min-h-[32px]">
              {inputValue ? `${formatCurrency(parseInt(inputValue) || 0)} FC` : "_"}
            </div>
          </div>
        );

      case "send_confirm":
        const sendFee = Math.round(amount * 0.01);
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">CONFIRMER ENVOI</p>
            <div className="mt-3 space-y-1">
              <p>Vers: +243 {phoneNumber}</p>
              <p>Montant: {formatCurrency(amount)} FC</p>
              <p>Frais: {formatCurrency(sendFee)} FC</p>
              <p className="font-bold border-t border-green-400/50 pt-2 mt-2">
                Total: {formatCurrency(amount + sendFee)} FC
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-green-400/50">
              <p>1. Confirmer</p>
              <p>2. Annuler</p>
            </div>
          </div>
        );

      case "send_pin":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">CODE PIN</p>
            <p className="mt-4">Entrez votre code PIN:</p>
            <div className="mt-2 p-2 border border-green-400/50 min-h-[32px] tracking-widest">
              {"•".repeat(inputValue.length) || "_"}
            </div>
            <p className="text-xs opacity-60 mt-2">4 chiffres requis</p>
          </div>
        );

      case "send_success":
        return (
          <div className="space-y-2 text-center">
            <p className="border-b border-green-400 pb-2">SUCCÈS ✓</p>
            <div className="py-6">
              <p className="text-2xl mb-2">✓</p>
              <p>Envoi réussi!</p>
              <p className="text-sm opacity-80 mt-2">{formatCurrency(amount)} FC</p>
              <p className="text-sm opacity-60">vers +243 {phoneNumber}</p>
              <p className="text-xs opacity-60 mt-4">Ref: TRX{Date.now().toString().slice(-8)}</p>
            </div>
            <p className="border-t border-green-400/50 pt-2">Appuyez # pour continuer</p>
          </div>
        );

      case "balance":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">VOTRE SOLDE</p>
            <div className="py-6 text-center">
              <p className="text-3xl font-bold">{formatCurrency(balance)} FC</p>
              <p className="text-sm opacity-60 mt-2">Disponible</p>
            </div>
            <p className="border-t border-green-400/50 pt-2 text-center">
              Appuyez # pour revenir
            </p>
          </div>
        );

      case "history":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">HISTORIQUE (5 dernières)</p>
            <div className="space-y-2 mt-3 text-sm">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex justify-between border-b border-green-400/20 pb-1">
                  <span className="truncate flex-1">
                    {tx.type === "sent" ? "→" : "←"} {tx.recipient.slice(0, 12)}
                  </span>
                  <span className={tx.type === "sent" ? "text-red-400" : "text-green-300"}>
                    {tx.type === "sent" ? "-" : "+"}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
            <p className="border-t border-green-400/50 pt-2 text-center mt-4">
              Appuyez # pour revenir
            </p>
          </div>
        );

      case "cashin":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">CASH IN - DÉPÔT</p>
            <p className="mt-3 text-sm opacity-80">Choisissez le réseau:</p>
            <div className="space-y-1 mt-2">
              <p>1. Vodacom M-Pesa</p>
              <p>2. Airtel Money</p>
              <p>3. Orange Money</p>
            </div>
            <p className="mt-4 pt-2 border-t border-green-400/50">0. Retour</p>
          </div>
        );

      case "cashout":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">CASH OUT - RETRAIT</p>
            <p className="mt-4">Entrez le code agent:</p>
            <p className="text-xs opacity-60">(Code affiché chez l'agent)</p>
            <div className="mt-4 p-2 border border-green-400/50 min-h-[32px]">
              {inputValue || "_"}
            </div>
          </div>
        );

      case "cashout_amount":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">MONTANT À RETIRER</p>
            <p className="text-sm opacity-80">Agent: {phoneNumber}</p>
            <p className="text-sm opacity-60">Solde: {formatCurrency(balance)} FC</p>
            <p className="mt-4">Entrez le montant (FC):</p>
            <div className="mt-2 p-2 border border-green-400/50 min-h-[32px]">
              {inputValue ? `${formatCurrency(parseInt(inputValue) || 0)} FC` : "_"}
            </div>
          </div>
        );

      case "cashout_confirm":
        const cashoutFee = Math.round(amount * 0.015);
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">CONFIRMER RETRAIT</p>
            <div className="mt-3 space-y-1">
              <p>Agent: {phoneNumber}</p>
              <p>Montant: {formatCurrency(amount)} FC</p>
              <p>Frais: {formatCurrency(cashoutFee)} FC</p>
              <p className="font-bold border-t border-green-400/50 pt-2 mt-2">
                Total débité: {formatCurrency(amount + cashoutFee)} FC
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-green-400/50">
              <p>1. Confirmer</p>
              <p>2. Annuler</p>
            </div>
          </div>
        );

      case "cashout_pin":
        return (
          <div className="space-y-2">
            <p className="border-b border-green-400 pb-2">CODE PIN</p>
            <p className="mt-4">Entrez votre code PIN:</p>
            <div className="mt-2 p-2 border border-green-400/50 min-h-[32px] tracking-widest">
              {"•".repeat(inputValue.length) || "_"}
            </div>
            <p className="text-xs opacity-60 mt-2">4 chiffres requis</p>
          </div>
        );

      case "cashout_success":
        return (
          <div className="space-y-2 text-center">
            <p className="border-b border-green-400 pb-2">RETRAIT AUTORISÉ ✓</p>
            <div className="py-6">
              <p className="text-2xl mb-2">✓</p>
              <p>Présentez ce code à l'agent:</p>
              <p className="text-2xl font-bold mt-2 tracking-widest">
                {Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>
              <p className="text-sm opacity-80 mt-4">{formatCurrency(amount)} FC</p>
              <p className="text-xs opacity-60">Valide 15 minutes</p>
            </div>
            <p className="border-t border-green-400/50 pt-2">Appuyez # pour continuer</p>
          </div>
        );

      default:
        return null;
    }
  };

  const Keypad = () => (
    <div className="grid grid-cols-3 gap-1 mt-4">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          className={`py-3 text-lg font-bold border border-green-400/50 hover:bg-green-400/20 transition-colors ${
            key === "#" ? "bg-green-400/10" : ""
          }`}
        >
          {key}
          {key === "*" && <span className="block text-[10px] opacity-60">Retour</span>}
          {key === "#" && <span className="block text-[10px] opacity-60">OK</span>}
        </button>
      ))}
      <button
        onClick={() => handleKeyPress("C")}
        className="col-span-3 py-2 text-sm border border-green-400/50 hover:bg-red-400/20 transition-colors text-red-400"
      >
        C - Effacer
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 safe-top safe-bottom flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-sm mx-auto w-full flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="border-2 border-green-400 p-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">KETNEY</h1>
              <p className="text-[10px] opacity-60">Agrément BCC - EME</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-60">Mode Bas Débit</p>
              <p className="text-xs">*123#</p>
            </div>
          </div>
          <button
            onClick={toggleUSSDMode}
            className="w-full mt-3 py-2 border border-green-400 hover:bg-green-400/20 transition-colors text-sm"
          >
            ✕ Quitter Mode Bas Débit
          </button>
        </div>

        {/* Screen Content */}
        <div className="border-2 border-green-400 p-4 flex-1 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Keypad */}
        <Keypad />

        {/* Footer */}
        <div className="mt-3 text-center text-[10px] opacity-50">
          <p>* = Retour | # = Confirmer | C = Effacer</p>
        </div>
      </motion.div>
    </div>
  );
};

export default USSDInterface;