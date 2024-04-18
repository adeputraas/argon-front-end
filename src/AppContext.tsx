import React, { createContext, useContext, useState } from 'react';

interface GlobalState {
  // Define your state properties here
  isProfileUpdate: boolean;
}
// Define the shape of your context
type AppContextType = {
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
};

// Create the context with an initial value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define a custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Create the provider component
export const AppProvider: React.FC = ({ children }) => {

  const initialGlobalState: GlobalState = {
    // Define initial values for your state properties here
    isProfileUpdate: false
  };

  const [globalState, setGlobalState] = useState<GlobalState>(initialGlobalState);;

  return <AppContext.Provider value={{ globalState, setGlobalState }}>{children}</AppContext.Provider>;
};
