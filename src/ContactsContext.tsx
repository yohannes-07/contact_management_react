import React, { createContext, useContext, useState } from 'react';
import { Contact } from './data';

type ContactsContextType = {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
};

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const useContactsContext = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContactsContext must be used within a ContactsProvider');
  }
  return context;
};

type ContactsProviderProps = {
  children: React.ReactNode; 
};

export const ContactsProvider: React.FC<ContactsProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};
