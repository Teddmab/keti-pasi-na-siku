import { createContext, useContext, useState, ReactNode } from "react";

interface USSDModeContextType {
  isUSSDMode: boolean;
  toggleUSSDMode: () => void;
}

const USSDModeContext = createContext<USSDModeContextType | undefined>(undefined);

export const USSDModeProvider = ({ children }: { children: ReactNode }) => {
  const [isUSSDMode, setIsUSSDMode] = useState(false);

  const toggleUSSDMode = () => {
    setIsUSSDMode((prev) => !prev);
  };

  return (
    <USSDModeContext.Provider value={{ isUSSDMode, toggleUSSDMode }}>
      {children}
    </USSDModeContext.Provider>
  );
};

export const useUSSDMode = () => {
  const context = useContext(USSDModeContext);
  if (!context) {
    throw new Error("useUSSDMode must be used within a USSDModeProvider");
  }
  return context;
};
