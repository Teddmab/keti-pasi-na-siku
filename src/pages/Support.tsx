import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MessageCircle, 
  Bot, 
  Send, 
  Phone, 
  Mail, 
  MapPin,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  type: "user" | "bot" | "agent";
  content: string;
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Comment envoyer de l'argent ?",
    answer: "Pour envoyer de l'argent, allez sur l'écran d'accueil, appuyez sur 'Envoyer', choisissez le réseau du destinataire, entrez son numéro et le montant, puis confirmez avec votre code PIN."
  },
  {
    question: "Quels sont les frais de transfert ?",
    answer: "Les transferts Ketney à Ketney sont gratuits. Les transferts vers d'autres réseaux (Airtel, Orange, Vodacom) ont des frais de 1% du montant."
  },
  {
    question: "Comment recharger mon compte ?",
    answer: "Vous pouvez recharger votre compte via Cash In chez un agent agréé. Trouvez l'agent le plus proche dans l'onglet 'Agents'."
  },
  {
    question: "Mon transfert est en attente, que faire ?",
    answer: "Les transferts sont généralement traités instantanément. Si votre transfert est en attente depuis plus de 5 minutes, contactez notre support via le chat."
  },
  {
    question: "Comment sécuriser mon compte ?",
    answer: "Activez la biométrie dans Paramètres > Sécurité, ne partagez jamais votre code PIN, et changez-le régulièrement."
  }
];

const aiResponses: Record<string, string> = {
  "bonjour": "Bonjour ! 👋 Je suis l'assistant KETNEY. Comment puis-je vous aider aujourd'hui ?",
  "hello": "Bonjour ! 👋 Je suis l'assistant KETNEY. Comment puis-je vous aider aujourd'hui ?",
  "salut": "Salut ! 👋 Je suis là pour vous aider. Que puis-je faire pour vous ?",
  "solde": "Pour vérifier votre solde, regardez en haut de l'écran d'accueil. Vous pouvez masquer/afficher le montant en appuyant sur l'icône œil 👁️",
  "frais": "Les frais de transfert sont de 1% pour les envois vers Airtel, Orange et Vodacom. Les transferts Ketney à Ketney sont GRATUITS ! 🎉",
  "agent": "Pour trouver un agent proche, allez dans l'onglet 'Agents'. Vous verrez une carte avec tous les agents disponibles autour de vous.",
  "pin": "Pour changer votre code PIN, allez dans Paramètres > Sécurité > Changer le code PIN. Vous devrez entrer votre ancien code puis le nouveau.",
  "aide": "Je peux vous aider avec : envoi d'argent, frais, agents, sécurité, et plus. Posez-moi votre question !",
  "merci": "Je vous en prie ! 😊 N'hésitez pas si vous avez d'autres questions.",
  "default": "Je comprends votre question. Pour une assistance plus personnalisée, je vous recommande de contacter notre équipe support via le chat en direct ou par téléphone au +243 999 KETNEY."
};

const Support = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"faq" | "chat" | "ai">("faq");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Bonjour ! 👋 Je suis l'assistant virtuel KETNEY. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    
    return aiResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        type: activeTab === "ai" ? "bot" : "agent",
        content: activeTab === "ai" 
          ? getAIResponse(userMessage.content)
          : "Un agent va vous répondre sous peu. Temps d'attente estimé : 2-3 minutes.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-border">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Aide & Support</h1>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-4 flex gap-2">
        {[
          { id: "faq", icon: MessageCircle, label: "FAQ" },
          { id: "ai", icon: Bot, label: "Assistant IA" },
          { id: "chat", icon: MessageCircle, label: "Chat Live" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto px-6 pb-8"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">Questions fréquentes</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="card-elevated overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-foreground pr-4">{faq.question}</span>
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedFaq === index ? "rotate-90" : ""
                      }`} />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-muted-foreground">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground mb-4">Nous contacter</h2>
                <div className="card-elevated divide-y divide-border">
                  <a href="tel:+243999538639" className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Téléphone</p>
                      <p className="text-sm text-muted-foreground">+243 999 KETNEY</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a href="mailto:support@ketney.cd" className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">support@ketney.cd</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Siège</p>
                      <p className="text-sm text-muted-foreground">Avenue du Commerce, Gombe, Kinshasa</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Assistant Tab */}
          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-2 flex gap-2 overflow-x-auto">
                {["Frais", "Agent", "PIN", "Solde"].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInputValue(action);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground whitespace-nowrap hover:bg-secondary/80"
                  >
                    {action}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-border safe-bottom">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Posez votre question..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Live Chat Tab */}
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Agent Info */}
              <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-lg font-bold text-accent-foreground">SK</span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Support KETNEY</p>
                    <p className="text-sm text-accent">En ligne • Répond en ~3 min</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <p className="text-sm text-foreground">
                      Bonjour ! Un agent va vous répondre sous peu. En attendant, pouvez-vous décrire votre problème ?
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Support • Maintenant</p>
                  </div>
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-border safe-bottom">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Écrivez votre message..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Support;
