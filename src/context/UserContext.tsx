import { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  id: string;
  type: "sent" | "received" | "cashin" | "cashout" | "bill";
  recipient: string;
  recipientPhone?: string;
  network: "Airtel" | "Orange" | "Vodacom" | "Ketney";
  amount: number;
  fee: number;
  status: "completed" | "pending" | "failed";
  date: string;
  timestamp: Date;
  transactionRef: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  read: boolean;
  date: string;
}

interface UserContextType {
  balance: number;
  balanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  transactions: Transaction[];
  notifications: Notification[];
  sendMoney: (recipient: string, recipientPhone: string, network: Transaction["network"], amount: number, fee: number) => Transaction;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  userName: string;
  userPhone: string;
  userInitials: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Generate realistic mock transactions
const generateMockTransactions = (): Transaction[] => {
  const now = new Date();
  return [
    {
      id: "txn_001",
      type: "sent",
      recipient: "Sarah Mbuyi",
      recipientPhone: "0891234567",
      network: "Orange",
      amount: 15000,
      fee: 150,
      status: "completed",
      date: "Aujourd'hui, 14:30",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001234",
    },
    {
      id: "txn_002",
      type: "received",
      recipient: "Jean Kabongo",
      recipientPhone: "0897654321",
      network: "Airtel",
      amount: 20000,
      fee: 0,
      status: "completed",
      date: "Aujourd'hui, 10:15",
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001233",
    },
    {
      id: "txn_003",
      type: "cashin",
      recipient: "Agent Gombe Central",
      recipientPhone: "",
      network: "Vodacom",
      amount: 50000,
      fee: 0,
      status: "completed",
      date: "Hier, 16:45",
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001232",
    },
    {
      id: "txn_004",
      type: "sent",
      recipient: "Marie Lukusa",
      recipientPhone: "0812345678",
      network: "Ketney",
      amount: 8000,
      fee: 0,
      status: "completed",
      date: "Hier, 09:20",
      timestamp: new Date(now.getTime() - 30 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001231",
    },
    {
      id: "txn_005",
      type: "received",
      recipient: "Papa Kabongo",
      recipientPhone: "0898765432",
      network: "Orange",
      amount: 100000,
      fee: 0,
      status: "completed",
      date: "20 Jan, 18:00",
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001230",
    },
    {
      id: "txn_006",
      type: "cashout",
      recipient: "Agent Bandal Market",
      recipientPhone: "",
      network: "Vodacom",
      amount: 30000,
      fee: 300,
      status: "completed",
      date: "19 Jan, 14:30",
      timestamp: new Date(now.getTime() - 72 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001229",
    },
    {
      id: "txn_007",
      type: "bill",
      recipient: "SNEL Électricité",
      recipientPhone: "",
      network: "Ketney",
      amount: 25000,
      fee: 250,
      status: "completed",
      date: "18 Jan, 11:00",
      timestamp: new Date(now.getTime() - 96 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001228",
    },
    {
      id: "txn_008",
      type: "sent",
      recipient: "Patrick Mutombo",
      recipientPhone: "0823456789",
      network: "Airtel",
      amount: 5000,
      fee: 50,
      status: "pending",
      date: "17 Jan, 15:45",
      timestamp: new Date(now.getTime() - 120 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001227",
    },
    {
      id: "txn_009",
      type: "received",
      recipient: "Mama Thérèse",
      recipientPhone: "0834567890",
      network: "Ketney",
      amount: 75000,
      fee: 0,
      status: "completed",
      date: "16 Jan, 09:30",
      timestamp: new Date(now.getTime() - 144 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001226",
    },
    {
      id: "txn_010",
      type: "sent",
      recipient: "Eric Tshisekedi",
      recipientPhone: "0845678901",
      network: "Orange",
      amount: 12000,
      fee: 120,
      status: "completed",
      date: "15 Jan, 20:15",
      timestamp: new Date(now.getTime() - 168 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001225",
    },
    {
      id: "txn_011",
      type: "cashin",
      recipient: "Agent Masina",
      recipientPhone: "",
      network: "Orange",
      amount: 200000,
      fee: 0,
      status: "completed",
      date: "14 Jan, 08:00",
      timestamp: new Date(now.getTime() - 192 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001224",
    },
    {
      id: "txn_012",
      type: "bill",
      recipient: "Canal+ Abonnement",
      recipientPhone: "",
      network: "Ketney",
      amount: 15000,
      fee: 0,
      status: "failed",
      date: "13 Jan, 14:20",
      timestamp: new Date(now.getTime() - 216 * 60 * 60 * 1000),
      transactionRef: "KTN-2024-001223",
    },
  ];
};

const initialNotifications: Notification[] = [];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(450000);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const toggleBalanceVisibility = () => {
    setBalanceVisible((prev) => !prev);
  };

  const sendMoney = (
    recipient: string,
    recipientPhone: string,
    network: Transaction["network"],
    amount: number,
    fee: number
  ): Transaction => {
    const total = amount + fee;
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: "sent",
      recipient,
      recipientPhone,
      network,
      amount,
      fee,
      status: "completed",
      date: "À l'instant",
      timestamp: new Date(),
      transactionRef: `KTN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    };

    setBalance((prev) => prev - total);
    setTransactions((prev) => [newTransaction, ...prev]);

    // Add notification
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      title: "Transfert réussi",
      message: `Vous avez envoyé ${amount.toLocaleString()} FC à ${recipient}`,
      type: "success",
      read: false,
      date: "À l'instant",
    };
    setNotifications((prev) => [newNotification, ...prev]);

    return newTransaction;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <UserContext.Provider
      value={{
        balance,
        balanceVisible,
        toggleBalanceVisibility,
        transactions,
        notifications,
        sendMoney,
        markNotificationRead,
        clearNotifications,
        userName: "Jean-Pierre Kabongo",
        userPhone: "089 000 1234",
        userInitials: "JP",
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
