import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RegistrationType = 'community' | 'enroll' | 'partnership' | 'blueprint';

export interface ModalInitialData {
  track?: string;
  program?: string;
  course?: string;
  resourceTitle?: string;
  resourceType?: string;
  [key: string]: any;
}

interface RegistrationContextProps {
  isOpen: boolean;
  type: RegistrationType;
  modalData: ModalInitialData;
  openModal: (type?: RegistrationType, data?: ModalInitialData) => void;
  closeModal: () => void;
}

const RegistrationContext = createContext<RegistrationContextProps | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<RegistrationType>('community');
  const [modalData, setModalData] = useState<ModalInitialData>({});

  const openModal = (t: RegistrationType = 'community', data: ModalInitialData = {}) => {
    setType(t);
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData({});
  };

  return (
    <RegistrationContext.Provider value={{ isOpen, type, modalData, openModal, closeModal }}>
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
