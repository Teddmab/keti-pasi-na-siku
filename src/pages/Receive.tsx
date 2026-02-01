import { motion } from "framer-motion";
import { ArrowLeft, Copy, Share2, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Receive = () => {
  const navigate = useNavigate();
  const accountNumber = "089 000 1234";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, ""));
    toast.success("Numéro copié !");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mon numéro KETNEY",
        text: `Envoyez-moi de l'argent sur KETNEY: +243 ${accountNumber}`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Recevoir de l'argent</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        {/* QR Code Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-elevated p-8 w-full max-w-xs text-center"
        >
          <p className="text-muted-foreground mb-6">Voici votre QR code</p>
          
          {/* Placeholder QR Code */}
          <div className="w-48 h-48 mx-auto bg-foreground rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-4 bg-background rounded-lg grid grid-cols-7 gap-1 p-2">
              {Array.from({ length: 49 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${
                    Math.random() > 0.5 ? "bg-foreground" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
            <div className="absolute w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Scannez pour recevoir un paiement
          </p>
        </motion.div>

        {/* Account Number */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-xs mt-6"
        >
          <p className="text-muted-foreground text-sm mb-2 text-center">
            Mon numéro KETNEY :
          </p>
          <div className="card-elevated p-4 flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">+243 {accountNumber}</span>
            <button
              onClick={handleCopy}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <Copy className="w-5 h-5 text-primary" />
            </button>
          </div>
        </motion.div>

        <div className="flex-1" />

        {/* Share Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full pb-8 safe-bottom space-y-3"
        >
          <button onClick={handleShare} className="btn-primary w-full flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Partager via WhatsApp
          </button>
          <button className="btn-secondary w-full flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5" />
            Partager via SMS
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Receive;
