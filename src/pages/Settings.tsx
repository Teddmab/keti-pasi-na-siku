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
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
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

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "fr", name: "Français", nativeName: "Français" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "ln", name: "Lingala", nativeName: "Lingála" },
];

const Settings = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Modal states
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("fr");
  
  // PIN change states
  const [pinStep, setPinStep] = useState<"current" | "new" | "confirm">("current");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

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
    setBiometricEnabled(enabled);
    toast.success(enabled ? "Biométrie activée" : "Biométrie désactivée");
  };

  const handleLanguageSelect = (code: Language) => {
    setSelectedLanguage(code);
    setLanguageModalOpen(false);
    toast.success(`Langue changée en ${getLanguageName(code)}`);
  };

  const settingGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: "Compte",
      items: [
        { id: "profile", icon: User, label: "Mon profil", value: "Jean-Pierre" },
        { id: "kyc", icon: FileText, label: "Niveau KYC", value: "Niveau 1", badge: "Améliorer" },
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
    </div>
  );
};

export default Settings;
