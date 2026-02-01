export type Language = "fr" | "en";

export const translations = {
  fr: {
    // Common
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      confirm: "Confirmer",
      save: "Enregistrer",
      delete: "Supprimer",
      edit: "Modifier",
      close: "Fermer",
      back: "Retour",
      next: "Suivant",
      search: "Rechercher",
      seeAll: "Voir tout",
      seeAllHistory: "Voir tout l'historique →",
    },
    
    // Navigation
    nav: {
      home: "Accueil",
      history: "Historique",
      scanner: "Scanner",
      agents: "Agents",
      settings: "Paramètres",
    },
    
    // Home
    home: {
      greeting: "Bonjour",
      myBalance: "Mon solde",
      availableBalance: "Mon solde disponible",
      send: "Envoyer",
      receive: "Recevoir",
      cashIn: "Cash In",
      cashOut: "Cash Out",
      recentTransactions: "Transactions récentes",
      quickTransfer: "Transfert rapide",
      viaQRCode: "Via QR code",
      deposit: "Dépôt d'argent",
      withdrawal: "Retrait d'argent",
      frequentContacts: "Contacts fréquents",
      thisMonth: "ce mois",
    },
    
    // Menu
    menu: {
      title: "Menu",
      notifications: "Notifications",
      agents: "Agents",
      virtualCards: "Cartes virtuelles",
      helpFaq: "Aide & FAQ",
      settings: "Paramètres",
    },
    
    // Settings
    settings: {
      title: "Paramètres",
      subtitle: "Gérez vos préférences",
      account: "Compte",
      editProfile: "Modifier le profil",
      editProfileDesc: "Photo, nom, téléphone",
      security: "Sécurité",
      securityDesc: "PIN, biométrie, 2FA",
      preferences: "Préférences",
      notifications: "Notifications",
      notificationsDesc: "Alertes et rappels",
      language: "Langue",
      languageDesc: "Français, English",
      appearance: "Apparence",
      appearanceDesc: "Thème clair/sombre",
      support: "Support",
      helpCenter: "Centre d'aide",
      helpCenterDesc: "FAQ et tutoriels",
      contactUs: "Nous contacter",
      contactUsDesc: "Support client",
      legal: "Légal",
      legalDesc: "CGU et confidentialité",
      lowBandwidth: "Mode Bas Débit",
      lowBandwidthDesc: "Interface simplifiée USSD",
      logout: "Déconnexion",
      version: "Version",
    },
    
    // History
    history: {
      title: "Historique",
      subtitle: "Toutes vos transactions",
      all: "Tout",
      sent: "Envoyé",
      received: "Reçu",
      cashIn: "Cash In",
      cashOut: "Cash Out",
      noTransactions: "Aucune transaction",
      agents: "Agents",
    },
    
    // Agents
    agents: {
      title: "Agents autour de vous",
      subtitle: "Trouvez un agent proche pour Cash In / Cash Out",
      searchPlaceholder: "Rechercher un agent...",
      agentList: "Liste des agents",
      agentsFound: "agents trouvés",
      open: "Ouvert",
      closed: "Fermé",
      viewList: "Voir la liste",
    },
    
    // Transactions
    transactions: {
      to: "À",
      from: "De",
      today: "Aujourd'hui",
      yesterday: "Hier",
      status: {
        completed: "Terminé",
        pending: "En attente",
        failed: "Échoué",
      },
    },
    
    // Send
    send: {
      title: "Envoyer de l'argent",
      recipient: "Destinataire",
      amount: "Montant",
      enterPhone: "Entrez le numéro de téléphone",
      enterAmount: "Entrez le montant",
      fees: "Frais",
      total: "Total",
      sendNow: "Envoyer maintenant",
      confirmTransfer: "Confirmer le transfert",
    },
    
    // Receive
    receive: {
      title: "Recevoir de l'argent",
      scanQR: "Scannez ce QR code",
      shareQR: "Partager le QR code",
      myNumber: "Mon numéro",
    },
    
    // Support
    support: {
      title: "Aide & Support",
      aiAssistant: "IA",
      liveChat: "Chat",
      faq: "FAQ",
    },
    
    // Auth
    auth: {
      welcome: "Bienvenue",
      login: "Connexion",
      logout: "Déconnexion",
      phoneNumber: "Numéro de téléphone",
      pin: "Code PIN",
      forgotPin: "PIN oublié ?",
    },
  },
  
  en: {
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      back: "Back",
      next: "Next",
      search: "Search",
      seeAll: "See all",
      seeAllHistory: "See all history →",
    },
    
    // Navigation
    nav: {
      home: "Home",
      history: "History",
      scanner: "Scanner",
      agents: "Agents",
      settings: "Settings",
    },
    
    // Home
    home: {
      greeting: "Hello",
      myBalance: "My balance",
      availableBalance: "Available balance",
      send: "Send",
      receive: "Receive",
      cashIn: "Cash In",
      cashOut: "Cash Out",
      recentTransactions: "Recent transactions",
      quickTransfer: "Quick transfer",
      viaQRCode: "Via QR code",
      deposit: "Deposit money",
      withdrawal: "Withdraw money",
      frequentContacts: "Frequent contacts",
      thisMonth: "this month",
    },
    
    // Menu
    menu: {
      title: "Menu",
      notifications: "Notifications",
      agents: "Agents",
      virtualCards: "Virtual cards",
      helpFaq: "Help & FAQ",
      settings: "Settings",
    },
    
    // Settings
    settings: {
      title: "Settings",
      subtitle: "Manage your preferences",
      account: "Account",
      editProfile: "Edit profile",
      editProfileDesc: "Photo, name, phone",
      security: "Security",
      securityDesc: "PIN, biometrics, 2FA",
      preferences: "Preferences",
      notifications: "Notifications",
      notificationsDesc: "Alerts and reminders",
      language: "Language",
      languageDesc: "Français, English",
      appearance: "Appearance",
      appearanceDesc: "Light/dark theme",
      support: "Support",
      helpCenter: "Help center",
      helpCenterDesc: "FAQ and tutorials",
      contactUs: "Contact us",
      contactUsDesc: "Customer support",
      legal: "Legal",
      legalDesc: "Terms and privacy",
      lowBandwidth: "Low Bandwidth Mode",
      lowBandwidthDesc: "Simplified USSD interface",
      logout: "Log out",
      version: "Version",
    },
    
    // History
    history: {
      title: "History",
      subtitle: "All your transactions",
      all: "All",
      sent: "Sent",
      received: "Received",
      cashIn: "Cash In",
      cashOut: "Cash Out",
      noTransactions: "No transactions",
      agents: "Agents",
    },
    
    // Agents
    agents: {
      title: "Agents near you",
      subtitle: "Find an agent nearby for Cash In / Cash Out",
      searchPlaceholder: "Search for an agent...",
      agentList: "Agent list",
      agentsFound: "agents found",
      open: "Open",
      closed: "Closed",
      viewList: "View list",
    },
    
    // Transactions
    transactions: {
      to: "To",
      from: "From",
      today: "Today",
      yesterday: "Yesterday",
      status: {
        completed: "Completed",
        pending: "Pending",
        failed: "Failed",
      },
    },
    
    // Send
    send: {
      title: "Send money",
      recipient: "Recipient",
      amount: "Amount",
      enterPhone: "Enter phone number",
      enterAmount: "Enter amount",
      fees: "Fees",
      total: "Total",
      sendNow: "Send now",
      confirmTransfer: "Confirm transfer",
    },
    
    // Receive
    receive: {
      title: "Receive money",
      scanQR: "Scan this QR code",
      shareQR: "Share QR code",
      myNumber: "My number",
    },
    
    // Support
    support: {
      title: "Help & Support",
      aiAssistant: "AI",
      liveChat: "Chat",
      faq: "FAQ",
    },
    
    // Auth
    auth: {
      welcome: "Welcome",
      login: "Login",
      logout: "Log out",
      phoneNumber: "Phone number",
      pin: "PIN code",
      forgotPin: "Forgot PIN?",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;
