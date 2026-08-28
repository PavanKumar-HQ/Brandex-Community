import React, { createContext, useContext, useState, ReactNode } from 'react';

type RegistrationType = 'community' | 'enroll';

interface RegistrationContextProps {
  isOpen: boolean;
  type: RegistrationType;
  openModal: (type?: RegistrationType) => void;
  closeModal: () => void;
}

const RegistrationContext = createContext<RegistrationContextProps | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<RegistrationType>('community');

  const openModal = (t: RegistrationType = 'community') => {
    setType(t);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <RegistrationContext.Provider value={{ isOpen, type, openModal, closeModal }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
