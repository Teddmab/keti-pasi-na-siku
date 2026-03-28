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
  Sparkles,
  Headphones,
  Clock,
  CheckCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  type: "user" | "bot" | "agent";
  content: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
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
    answer: "Les transferts KaziPay à KaziPay sont gratuits. Les transferts vers d'autres réseaux (Airtel, Orange, Vodacom) ont des frais de 1% du montant."
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

// Enhanced AI responses with context awareness
const getAIResponse = (input: string, messageHistory: Message[]): string => {
  const lowerInput = input.toLowerCase();
  
  // Greeting detection
  if (/^(bonjour|salut|hello|hi|hey|bonsoir)/i.test(lowerInput)) {
    return "Bonjour ! 👋 Je suis votre assistant virtuel KaziPay. Je peux vous aider avec :\n\n• Envoi et réception d'argent\n• Frais de transfert\n• Trouver un agent\n• Sécurité du compte\n• Problèmes techniques\n\nQue puis-je faire pour vous ?";
  }
  
  // Balance related
  if (lowerInput.includes("solde") || lowerInput.includes("balance") || lowerInput.includes("argent")) {
    return "💰 **Consulter votre solde**\n\nVotre solde est affiché en haut de l'écran d'accueil. Vous pouvez :\n\n1. Appuyer sur l'icône 👁️ pour masquer/afficher le montant\n2. Activer le Mode Bas Débit pour voir le solde en format texte\n\nVotre solde actuel est visible uniquement par vous.";
  }
  
  // Fees related
  if (lowerInput.includes("frais") || lowerInput.includes("commission") || lowerInput.includes("coût")) {
    return "💸 **Frais de transfert KaziPay**\n\n✅ **Gratuit** : KaziPay → KaziPay\n📱 **1%** : KaziPay → Airtel, Orange, Vodacom\n\n*Exemple : Pour 10,000 FC vers Orange, les frais sont de 100 FC*\n\nLes frais de Cash Out dépendent du montant et de l'agent.";
  }
  
  // Agent related
  if (lowerInput.includes("agent") || lowerInput.includes("retrait") || lowerInput.includes("dépôt") || lowerInput.includes("cash")) {
    return "📍 **Trouver un agent KaziPay**\n\n1. Allez dans l'onglet **Agents** en bas de l'écran\n2. La carte affiche tous les agents près de vous\n3. Appuyez sur un agent pour voir ses horaires\n\n💡 Astuce : Les agents avec le badge ⭐ ont les meilleures évaluations !";
  }
  
  // PIN/Security related
  if (lowerInput.includes("pin") || lowerInput.includes("sécurité") || lowerInput.includes("mot de passe") || lowerInput.includes("biométrie")) {
    return "🔒 **Sécurité de votre compte**\n\n**Changer le code PIN :**\nParamètres → Sécurité → Changer le code PIN\n\n**Activer la biométrie :**\nParamètres → Sécurité → Biométrie\n\n⚠️ **Important** : Ne partagez JAMAIS votre code PIN !";
  }
  
  // Transfer issues
  if (lowerInput.includes("problème") || lowerInput.includes("erreur") || lowerInput.includes("échoué") || lowerInput.includes("attente")) {
    return "🔧 **Résoudre un problème de transfert**\n\nSi votre transfert a échoué :\n\n1. Vérifiez votre connexion internet\n2. Assurez-vous que le numéro est correct\n3. Vérifiez votre solde disponible\n\nSi le problème persiste après 5 minutes, contactez notre support via **Chat Live** pour une assistance personnalisée.";
  }
  
  // Virtual cards
  if (lowerInput.includes("carte") || lowerInput.includes("virtuelle") || lowerInput.includes("visa") || lowerInput.includes("mastercard")) {
    return "💳 **Cartes Virtuelles KaziPay**\n\nVous pouvez créer une carte virtuelle pour vos achats en ligne :\n\n1. Allez dans **Mes Cartes** dans le menu\n2. Appuyez sur **Générer une carte**\n3. Choisissez VISA ou Mastercard\n\nLa carte est liée à votre solde KaziPay. Touchez la carte pour voir le CVV !";
  }
  
  // Thanks
  if (lowerInput.includes("merci") || lowerInput.includes("thank")) {
    return "Je vous en prie ! 😊\n\nN'hésitez pas à revenir si vous avez d'autres questions. Je suis disponible 24h/24 pour vous aider !\n\n⭐ Votre satisfaction est notre priorité.";
  }
  
  // Goodbye
  if (lowerInput.includes("au revoir") || lowerInput.includes("bye") || lowerInput.includes("à bientôt")) {
    return "Au revoir ! 👋\n\nMerci d'avoir utilisé l'assistant KaziPay. Passez une excellente journée !\n\n🇨🇩 *KaziPay - Votre argent, simplifié*";
  }
  
  // Default intelligent response
  const contextAware = messageHistory.length > 2 
    ? "\n\nJe vois que nous discutons depuis un moment. " 
    : "";
  
  return `Je comprends votre question concernant "${input.slice(0, 30)}${input.length > 30 ? '...' : ''}".${contextAware}\n\nPour une réponse plus précise, vous pouvez :\n\n• Reformuler votre question\n• Utiliser les boutons rapides ci-dessous\n• Contacter un agent via **Chat Live**\n\nJe suis là pour vous aider ! 🤝`;
};

// Mock agent responses for live chat
const agentResponses = [
  "Bonjour ! Je suis Marie du support KaziPay. Je vois votre demande et je consulte votre dossier...",
  "Merci pour ces informations. Pouvez-vous me donner le numéro de référence de la transaction ?",
  "Je comprends votre préoccupation. Laissez-moi vérifier cela dans notre système...",
  "D'après nos informations, je vois que la transaction a bien été effectuée. Le délai de traitement est de 5-10 minutes.",
  "Est-ce que cela répond à votre question ? N'hésitez pas si vous avez besoin d'autres informations.",
  "Je reste à votre disposition. Y a-t-il autre chose que je puisse faire pour vous ?",
];

const Support = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"faq" | "chat" | "ai">("faq");
  
  // Separate message states for AI and Live Chat
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: "ai-welcome",
      type: "bot",
      content: "Bonjour ! 👋 Je suis l'assistant virtuel KaziPay, propulsé par l'intelligence artificielle.\n\nJe peux répondre à vos questions sur :\n• Transferts d'argent\n• Frais et commissions\n• Agents et points de service\n• Sécurité du compte\n\nComment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "chat-welcome",
      type: "agent",
      content: "Bienvenue sur le support KaziPay ! 👋\n\nUn agent va vous répondre dans quelques instants. En attendant, décrivez votre problème pour nous aider à vous assister plus rapidement.",
      timestamp: new Date(),
      status: "read"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"online" | "typing" | "away">("online");
  const [agentResponseIndex, setAgentResponseIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, chatMessages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      status: "sent"
    };

    if (activeTab === "ai") {
      setAiMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      // Simulate AI thinking
      const thinkingTime = 800 + Math.random() * 1200;
      setTimeout(() => {
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          type: "bot",
          content: getAIResponse(userMessage.content, aiMessages),
          timestamp: new Date()
        };
        setAiMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, thinkingTime);
    } else if (activeTab === "chat") {
      setChatMessages(prev => [...prev, { ...userMessage, status: "delivered" }]);
      setInputValue("");
      
      // Simulate message being read
      setTimeout(() => {
        setChatMessages(prev => 
          prev.map(m => m.id === userMessage.id ? { ...m, status: "read" as const } : m)
        );
      }, 1000);
      
      // Simulate agent typing
      setTimeout(() => {
        setAgentStatus("typing");
        setIsTyping(true);
      }, 1500);
      
      // Simulate agent response
      const responseTime = 2500 + Math.random() * 2000;
      setTimeout(() => {
        const agentMessage: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          content: agentResponses[agentResponseIndex % agentResponses.length],
          timestamp: new Date(),
          status: "read"
        };
        setChatMessages(prev => [...prev, agentMessage]);
        setAgentResponseIndex(prev => prev + 1);
        setIsTyping(false);
        setAgentStatus("online");
      }, responseTime);
    }
  };

  const currentMessages = activeTab === "ai" ? aiMessages : chatMessages;

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
      <div className="px-4 py-3 flex gap-1.5">
        {[
          { id: "faq", icon: MessageCircle, label: "FAQ" },
          { id: "ai", icon: Sparkles, label: "IA" },
          { id: "chat", icon: Headphones, label: "Chat" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs">{tab.label}</span>
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
                      <p className="text-sm text-muted-foreground">+243 999 KaziPay</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a href="mailto:support@kazipay.cd" className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">support@kazipay.cd</p>
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
              {/* AI Header */}
              <div className="px-6 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Assistant KaziPay</p>
                    <p className="text-xs text-muted-foreground">Propulsé par IA • Disponible 24/7</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {aiMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && activeTab === "ai" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-sm text-muted-foreground">Réflexion en cours</span>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                {[
                  { label: "💸 Frais", query: "Quels sont les frais de transfert ?" },
                  { label: "📍 Agent", query: "Comment trouver un agent ?" },
                  { label: "🔒 Sécurité", query: "Comment sécuriser mon compte ?" },
                  { label: "💳 Cartes", query: "Comment créer une carte virtuelle ?" },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      setInputValue(action.query);
                      setTimeout(() => {
                        const input = document.querySelector('input[placeholder="Posez votre question..."]') as HTMLInputElement;
                        if (input) {
                          input.focus();
                        }
                      }, 100);
                    }}
                    className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground whitespace-nowrap hover:bg-secondary/80 transition-colors"
                  >
                    {action.label}
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
                    disabled={!inputValue.trim() || isTyping}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center disabled:opacity-50 transition-opacity"
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
                      <span className="text-lg font-bold text-accent-foreground">MK</span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background ${
                      agentStatus === "online" ? "bg-green-500" : 
                      agentStatus === "typing" ? "bg-yellow-500" : "bg-gray-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Marie K. - Support KaziPay</p>
                    <div className="flex items-center gap-2">
                      {agentStatus === "typing" ? (
                        <span className="text-sm text-primary">En train d'écrire...</span>
                      ) : (
                        <>
                          <span className="text-sm text-accent">En ligne</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ~3 min
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        message.type === "user" ? "justify-end" : ""
                      }`}>
                        <p className={`text-xs ${
                          message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {message.type === "user" && message.status && (
                          <CheckCheck className={`w-4 h-4 ${
                            message.status === "read" ? "text-accent" : "text-primary-foreground/50"
                          }`} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && activeTab === "chat" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Marie écrit</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Messages */}
              <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                {[
                  "J'ai un problème avec un transfert",
                  "Mon argent n'est pas arrivé",
                  "Question sur les frais",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground whitespace-nowrap hover:bg-secondary/80 transition-colors"
                  >
                    {suggestion}
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
                    placeholder="Écrivez votre message..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center disabled:opacity-50 transition-opacity"
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