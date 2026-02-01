import { motion } from "framer-motion";
import { Phone, Search, X, User } from "lucide-react";
import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  initials: string;
}

interface ContactPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (contact: Contact) => void;
}

const mockContacts: Contact[] = [
  { id: "1", name: "Sarah Mbuyi", phone: "0891234567", initials: "SM" },
  { id: "2", name: "Jean Kabongo", phone: "0897654321", initials: "JK" },
  { id: "3", name: "Marie Lukusa", phone: "0812345678", initials: "ML" },
  { id: "4", name: "Patrick Mutombo", phone: "0823456789", initials: "PM" },
  { id: "5", name: "Thérèse Kasongo", phone: "0834567890", initials: "TK" },
  { id: "6", name: "Eric Tshisekedi", phone: "0845678901", initials: "ET" },
  { id: "7", name: "Papa Kabongo", phone: "0856789012", initials: "PK" },
  { id: "8", name: "Mama Thérèse", phone: "0867890123", initials: "MT" },
  { id: "9", name: "Joseph Mbeki", phone: "0878901234", initials: "JM" },
  { id: "10", name: "Christine Lumumba", phone: "0889012345", initials: "CL" },
];

const ContactPicker = ({ isOpen, onClose, onSelect }: ContactPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  const formatPhone = (phone: string) => {
    return `+243 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-card rounded-t-3xl w-full max-w-md max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Répertoire</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un contact..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun contact trouvé</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  onSelect(contact);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">{contact.initials}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{formatPhone(contact.phone)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPicker;
