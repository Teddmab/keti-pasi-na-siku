import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  Globe, 
  Shield, 
  Fingerprint, 
  HelpCircle, 
  LogOut,
  User,
  Bell,
  FileText,
  X,
  Check,
  ArrowLeft,
  Upload,
  Camera,
  Loader2,
  CreditCard,
  Wifi
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUSSDMode } from "@/context/USSDModeContext";
import { toast } from "sonner";
import mockApi from "@/lib/mockApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";

interface SettingItem {
  id: string;
  icon: React.ElementType;
  label: string;
  value?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}

type Language = "fr" | "sw" | "ln";
type KYCStep = "intro" | "document" | "uploading" | "verifying" | "success";

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "fr", name: "Français", nativeName: "Français" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "ln", name: "Lingala", nativeName: "Lingála" },
];

const Settings = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isUSSDMode, toggleUSSDMode } = useUSSDMode();
  
  // Modal states
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [biometricModalOpen, setBiometricModalOpen] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricStep, setBiometricStep] = useState<"intro" | "scanning" | "success" | "disable">("intro");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("fr");
  const [kycLevel, setKycLevel] = useState(1);
  
  // PIN change states
  const [pinStep, setPinStep] = useState<"current" | "new" | "confirm">("current");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  
  // KYC states
  const [kycStep, setKycStep] = useState<KYCStep>("intro");
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  const getLanguageName = (code: Language) => {
    return languages.find(l => l.code === code)?.name || "Français";
  };

  const handlePinInput = (digit: string, type: "current" | "new" | "confirm") => {
    const setters = { current: setCurrentPin, new: setNewPin, confirm: setConfirmPin };
    const values = { current: currentPin, new: newPin, confirm: confirmPin };
    
    if (values[type].length < 4) {
      const newValue = values[type] + digit;
      setters[type](newValue);
      setPinError("");
      
      if (newValue.length === 4) {
        if (type === "current") {
          // Simulate PIN verification (in real app, verify against stored PIN)
          setTimeout(() => setPinStep("new"), 300);
        } else if (type === "new") {
          setTimeout(() => setPinStep("confirm"), 300);
        } else if (type === "confirm") {
          if (newValue === newPin) {
            toast.success("Code PIN modifié avec succès !");
            resetPinModal();
          } else {
            setPinError("Les codes PIN ne correspondent pas");
            setConfirmPin("");
          }
        }
      }
    }
  };

  const handlePinDelete = (type: "current" | "new" | "confirm") => {
    const setters = { current: setCurrentPin, new: setNewPin, confirm: setConfirmPin };
    const values = { current: currentPin, new: newPin, confirm: confirmPin };
    setters[type](values[type].slice(0, -1));
    setPinError("");
  };

  const resetPinModal = () => {
    setPinModalOpen(false);
    setPinStep("current");
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setPinError("");
  };

  const handleBiometricToggle = (enabled: boolean) => {
    if (enabled) {
      // Open enrollment flow
      setBiometricStep("intro");
      setBiometricModalOpen(true);
    } else {
      // Open disable confirmation
      setBiometricStep("disable");
      setBiometricModalOpen(true);
    }
  };

  const handleBiometricEnroll = () => {
    setBiometricStep("scanning");
    
    // Simulate biometric scanning
    setTimeout(() => {
      setBiometricStep("success");
      setBiometricEnabled(true);
      
      setTimeout(() => {
        setBiometricModalOpen(false);
        setBiometricStep("intro");
        toast.success("Biométrie activée avec succès !");
      }, 1500);
    }, 2500);
  };

  const handleBiometricDisable = () => {
    setBiometricEnabled(false);
    setBiometricModalOpen(false);
    setBiometricStep("intro");
    toast.success("Biométrie désactivée");
  };

  const resetBiometricModal = () => {
    setBiometricModalOpen(false);
    setBiometricStep("intro");
  };

  const handleLanguageSelect = (code: Language) => {
    setSelectedLanguage(code);
    setLanguageModalOpen(false);
    toast.success(`Langue changée en ${getLanguageName(code)}`);
  };

  // KYC Flow handlers
  const handleKycDocumentSelect = () => {
    // Simulate file selection
    setSelectedDocument({ name: "carte_electeur.jpg" } as File);
    setKycStep("uploading");
    
    setTimeout(async () => {
      setKycStep("verifying");
      try {
        await mockApi.verifyIdentity("carte_electeur");
        setKycStep("success");
        setKycLevel(2);
        toast.success("Niveau KYC mis à jour!");
      } catch (error) {
        toast.error("Échec de la vérification");
        setKycStep("intro");
      }
    }, 2000);
  };

  const resetKycModal = () => {
    setKycModalOpen(false);
    setKycStep("intro");
    setSelectedDocument(null);
  };

  const settingGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: "Compte",
      items: [
        { id: "profile", icon: User, label: "Mon profil", value: "Jean-Pierre" },
        { id: "kyc", icon: FileText, label: "Niveau KYC", value: `Niveau ${kycLevel}`, badge: kycLevel < 3 ? "Améliorer" : undefined, onClick: () => setKycModalOpen(true) },
        { id: "cards", icon: CreditCard, label: "Mes Cartes Virtuelles", onClick: () => navigate("/cards") },
        { id: "notifications", icon: Bell, label: "Notifications" },
      ],
    },
    {
      title: "Sécurité",
      items: [
        { id: "pin", icon: Shield, label: "Changer le code PIN", onClick: () => setPinModalOpen(true) },
        { id: "biometric", icon: Fingerprint, label: "Biométrie", value: biometricEnabled ? "Activée" : "Désactivée" },
      ],
    },
    {
      title: "Préférences",
      items: [
        { id: "language", icon: Globe, label: "Langue", value: getLanguageName(selectedLanguage), onClick: () => setLanguageModalOpen(true) },
        { id: "ussd", icon: Wifi, label: "Mode Bas Débit", value: isUSSDMode ? "Activé" : "Désactivé" },
      ],
    },
    {
      title: "Support",
      items: [
        { id: "help", icon: HelpCircle, label: "Aide & Support", onClick: () => navigate("/support") },
        ...(isMobile ? [{ id: "logout", icon: LogOut, label: "Se déconnecter", danger: true, onClick: () => navigate("/") }] : []),
      ],
    },
  ];

  // PIN Keypad Component
  const PinKeypad = ({ value, onInput, onDelete }: { value: string; onInput: (digit: string) => void; onDelete: () => void }) => (
    <div className="flex flex-col items-center">
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={value.length === i + 1 ? { scale: 1.2 } : {}}
            animate={{ scale: 1 }}
            className={`w-4 h-4 rounded-full transition-colors ${value.length > i ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((num, i) => (
          <button
            key={i}
            onClick={() => {
              if (num === "del") onDelete();
              else if (num !== null) onInput(String(num));
            }}
            disabled={num === null}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${
              num === null ? "invisible" : num === "del" ? "bg-secondary text-foreground" : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {num === "del" ? "←" : num}
          </button>
        ))}
      </div>
    </div>
  );

  // PIN Modal Content
  const PinModalContent = () => {
    const stepInfo = {
      current: { title: "Code PIN actuel", subtitle: "Entrez votre code PIN actuel" },
      new: { title: "Nouveau code PIN", subtitle: "Entrez votre nouveau code PIN" },
      confirm: { title: "Confirmer le code", subtitle: "Entrez à nouveau le nouveau code" },
    };

    const currentValue = { current: currentPin, new: newPin, confirm: confirmPin }[pinStep];

    return (
      <div className="flex flex-col items-center py-4">
        <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">{stepInfo[pinStep].title}</h3>
        <p className="text-muted-foreground text-sm mb-6">{stepInfo[pinStep].subtitle}</p>
        
        {pinError && (
          <div className="mb-4 px-4 py-2 bg-destructive/10 text-destructive text-sm rounded-lg">
            {pinError}
          </div>
        )}
        
        <PinKeypad
          value={currentValue}
          onInput={(digit) => handlePinInput(digit, pinStep)}
          onDelete={() => handlePinDelete(pinStep)}
        />
        
        {pinStep !== "current" && (
          <button
            onClick={() => {
              if (pinStep === "new") {
                setPinStep("current");
                setNewPin("");
              } else {
                setPinStep("new");
                setConfirmPin("");
              }
            }}
            className="mt-6 text-primary font-medium"
          >
            Retour
          </button>
        )}
      </div>
    );
  };

  // Language Modal Content
  const LanguageModalContent = () => (
    <div className="py-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageSelect(lang.code)}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
            selectedLanguage === lang.code ? "bg-primary/10" : "hover:bg-secondary"
          }`}
        >
          <div className="text-left">
            <p className="font-medium text-foreground">{lang.name}</p>
            <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
          </div>
          {selectedLanguage === lang.code && (
            <Check className="w-5 h-5 text-primary" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className={isMobile ? "pb-24 safe-top" : "py-2"}>
      {/* Header */}
      <div className={isMobile ? "px-6 pt-6 pb-4" : "mb-6"}>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
      </div>

      {/* Profile Card - Only on mobile */}
      {isMobile && (
        <div className="px-6 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="card-elevated p-5 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">JP</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">Jean-Pierre Kabongo</h2>
              <p className="text-muted-foreground">+243 089 000 1234</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      )}

      {/* Settings Groups */}
      <div className={`space-y-6 ${isMobile ? "px-6" : "grid lg:grid-cols-2 lg:gap-6 lg:space-y-0"}`}>
        {settingGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              {group.title}
            </h3>
            <div className="card-elevated overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 transition-colors ${
                    itemIndex < group.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  {/* Biometric uses a switch instead of navigation */}
                  {item.id === "biometric" ? (
                    <>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                        <item.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="flex-1 text-left font-medium text-foreground">
                        {item.label}
                      </span>
                      <Switch
                        checked={biometricEnabled}
                        onCheckedChange={handleBiometricToggle}
                      />
                    </>
                  ) : item.id === "ussd" ? (
                    <>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                        <item.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="flex-1 text-left font-medium text-foreground">
                        {item.label}
                      </span>
                      <Switch
                        checked={isUSSDMode}
                        onCheckedChange={toggleUSSDMode}
                      />
                    </>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="flex-1 flex items-center gap-4 hover:bg-secondary/50 -m-4 p-4 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.danger ? "bg-destructive/10" : "bg-secondary"
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          item.danger ? "text-destructive" : "text-foreground"
                        }`} />
                      </div>
                      
                      <span className={`flex-1 text-left font-medium ${
                        item.danger ? "text-destructive" : "text-foreground"
                      }`}>
                        {item.label}
                      </span>
                      
                      {item.value && (
                        <span className="text-muted-foreground text-sm">{item.value}</span>
                      )}
                      
                      {item.badge && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {item.badge}
                        </span>
                      )}
                      
                      {!item.danger && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Version - Only on mobile */}
      {isMobile && (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">KETNEY v1.0.0</p>
        </div>
      )}

      {/* PIN Change Modal/Drawer */}
      {isMobile ? (
        <Drawer open={pinModalOpen} onOpenChange={(open) => !open && resetPinModal()}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Changer le code PIN</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">
              <PinModalContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={pinModalOpen} onOpenChange={(open) => !open && resetPinModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Changer le code PIN</DialogTitle>
            </DialogHeader>
            <PinModalContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Language Modal/Drawer */}
      {isMobile ? (
        <Drawer open={languageModalOpen} onOpenChange={setLanguageModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Choisir la langue</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">
              <LanguageModalContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={languageModalOpen} onOpenChange={setLanguageModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choisir la langue</DialogTitle>
            </DialogHeader>
            <LanguageModalContent />
          </DialogContent>
        </Dialog>
      )}

      {/* KYC Modal/Drawer */}
      {isMobile ? (
        <Drawer open={kycModalOpen} onOpenChange={(open) => !open && resetKycModal()}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Vérification KYC</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">
              <KYCModalContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={kycModalOpen} onOpenChange={(open) => !open && resetKycModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Vérification KYC - Conformité BCC</DialogTitle>
            </DialogHeader>
            <KYCModalContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Biometric Modal/Drawer */}
      {isMobile ? (
        <Drawer open={biometricModalOpen} onOpenChange={(open) => !open && resetBiometricModal()}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {biometricStep === "disable" ? "Désactiver la biométrie" : "Activer la biométrie"}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">
              <BiometricModalContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={biometricModalOpen} onOpenChange={(open) => !open && resetBiometricModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {biometricStep === "disable" ? "Désactiver la biométrie" : "Activer la biométrie"}
              </DialogTitle>
            </DialogHeader>
            <BiometricModalContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  // Biometric Modal Content
  function BiometricModalContent() {
    return (
      <div className="py-4">
        <AnimatePresence mode="wait">
          {biometricStep === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
                <Fingerprint className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                Sécurisez votre compte
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Utilisez votre empreinte digitale ou Face ID pour une connexion rapide et sécurisée
              </p>
              
              <div className="w-full space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">Sécurité renforcée</p>
                    <p className="text-xs text-muted-foreground">Protection supplémentaire</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">Connexion rapide</p>
                    <p className="text-xs text-muted-foreground">Accédez en un instant</p>
                  </div>
                </div>
              </div>

              <button onClick={handleBiometricEnroll} className="btn-primary w-full">
                Activer la biométrie
              </button>
              <button 
                onClick={resetBiometricModal} 
                className="mt-3 text-muted-foreground font-medium"
              >
                Peut-être plus tard
              </button>
            </motion.div>
          )}

          {biometricStep === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center py-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 rounded-full bg-primary/10 mb-6 flex items-center justify-center relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary/30"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <Fingerprint className="w-12 h-12 text-primary" />
              </motion.div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                Scan en cours...
              </h3>
              <p className="text-sm text-muted-foreground">
                Placez votre doigt sur le capteur ou regardez la caméra
              </p>
            </motion.div>
          )}

          {biometricStep === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-accent mb-6 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-accent-foreground" />
              </motion.div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                Biométrie activée!
              </h3>
              <p className="text-sm text-muted-foreground">
                Votre compte est maintenant protégé par la biométrie
              </p>
            </motion.div>
          )}

          {biometricStep === "disable" && (
            <motion.div
              key="disable"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/10 mb-6 flex items-center justify-center">
                <Fingerprint className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                Désactiver la biométrie ?
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Vous devrez utiliser votre code PIN pour confirmer vos transactions
              </p>
              
              <div className="w-full space-y-3">
                <button 
                  onClick={handleBiometricDisable} 
                  className="w-full py-3 px-4 bg-destructive text-destructive-foreground font-semibold rounded-xl"
                >
                  Désactiver
                </button>
                <button 
                  onClick={resetBiometricModal} 
                  className="btn-secondary w-full"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // KYC Modal Content
  function KYCModalContent() {
    return (
      <div className="py-4">
        <AnimatePresence mode="wait">
          {kycStep === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Niveau actuel: {kycLevel}</h3>
                <p className="text-sm text-muted-foreground">
                  Augmentez votre niveau pour des limites plus élevées
                </p>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-xl border ${kycLevel >= 1 ? "border-accent bg-accent/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    {kycLevel >= 1 ? <Check className="w-5 h-5 text-accent" /> : <div className="w-5 h-5 rounded-full border-2 border-border" />}
                    <div>
                      <p className="font-medium text-foreground">Niveau 1 - Basique</p>
                      <p className="text-xs text-muted-foreground">Numéro de téléphone vérifié</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${kycLevel >= 2 ? "border-accent bg-accent/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    {kycLevel >= 2 ? <Check className="w-5 h-5 text-accent" /> : <div className="w-5 h-5 rounded-full border-2 border-border" />}
                    <div>
                      <p className="font-medium text-foreground">Niveau 2 - Vérifié</p>
                      <p className="text-xs text-muted-foreground">Carte d'Électeur / Pièce d'identité</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${kycLevel >= 3 ? "border-accent bg-accent/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    {kycLevel >= 3 ? <Check className="w-5 h-5 text-accent" /> : <div className="w-5 h-5 rounded-full border-2 border-border" />}
                    <div>
                      <p className="font-medium text-foreground">Niveau 3 - Premium</p>
                      <p className="text-xs text-muted-foreground">Justificatif de domicile</p>
                    </div>
                  </div>
                </div>
              </div>

              {kycLevel < 2 && (
                <button
                  onClick={() => setKycStep("document")}
                  className="btn-primary w-full mt-6"
                >
                  Passer au Niveau 2
                </button>
              )}
            </motion.div>
          )}

          {kycStep === "document" && (
            <motion.div
              key="document"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Carte d'Électeur</h3>
                <p className="text-sm text-muted-foreground">
                  Téléchargez une photo claire de votre Carte d'Électeur
                </p>
              </div>

              <button
                onClick={handleKycDocumentSelect}
                className="w-full p-8 border-2 border-dashed border-primary/30 rounded-2xl hover:bg-primary/5 transition-colors"
              >
                <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-medium text-foreground">Cliquez pour télécharger</p>
                <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
              </button>

              <button
                onClick={() => setKycStep("intro")}
                className="btn-secondary w-full"
              >
                Retour
              </button>
            </motion.div>
          )}

          {(kycStep === "uploading" || kycStep === "verifying") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h3 className="font-bold text-foreground mb-2">
                {kycStep === "uploading" ? "Téléchargement..." : "Vérification en cours..."}
              </h3>
              <p className="text-sm text-muted-foreground">
                {kycStep === "uploading" 
                  ? "Envoi de votre document" 
                  : "Vérification d'identité - Conformité AML/KYC"}
              </p>
            </motion.div>
          )}

          {kycStep === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <h3 className="font-bold text-foreground mb-2">Vérification réussie!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Vous êtes maintenant au Niveau {kycLevel}
              </p>
              <button onClick={resetKycModal} className="btn-primary">
                Terminé
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
};

export default Settings;
