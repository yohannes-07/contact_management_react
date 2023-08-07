export type Contact = {
    id?: number
    name: string,
    phoneNumber: string,
    email: string
    website? : string,
    twitter?: string,

}

export const mockContacts:Contact[] = [
    {   id:1,
        name: "Yohannes",
        phoneNumber: "25197846389",
        email: 'yohannes@example.com',
        website: 'www.yohannesWeb.com',
        twitter: 'https://www.twitter/yohannes'
    },

    {
        id:2,
        name: "Abel",
        phoneNumber: "25155846389",
        email: 'abel@example.com',
        website: 'www.abelWeb.com',
        twitter: 'https://www.twitter/abel'
    },
    {
        id:3,
        name: "Rihanna",
        phoneNumber: "2519666389",
        email: 'rihanna@example.com',
        website: 'www.rihannaWeb.com',
        
    },
    {
        id:4,
        name: "Daniel",
        phoneNumber: "2510006389",
        email: 'daniel@example.com',
        website: 'www.danielWeb.com',
        twitter: 'https://www.twitter/daniel'
    },
    {
        id:5,
        name: "Hirut",
        phoneNumber: "25199946389",
        email: 'hirut@example.com',
        website: 'www.hirutWeb.com',
        twitter: 'https://www.twitter/hirut'
    },
    {
        id:6,
        name: "Zerihun",
        phoneNumber: "25133846389",
        email: 'zerihun@example.com',
        website: 'www.zerihunWeb.com',
        twitter: 'https://www.twitter/zerihun'
    }
]

export const readContacts = (): Contact[]  => {
    return mockContacts;
  };

export const readContact = (id: number): Contact | undefined => {
    const contact =  mockContacts.find((contact) => contact.id === id);
    console.log(contact)
    return contact;
  };

export const createNewContact = (newContact: Omit<Contact, 'id'>): Contact => {
  const newIndex = mockContacts.length + 1;

  const createdContact: Contact = {
    id: newIndex,
    ...newContact,
  };

  mockContacts.push(createdContact);
  return createdContact;
};

export const editContact = (id: number | undefined, updatedContactData: Omit<Contact, 'id'>): Contact | undefined => {
    const index = mockContacts.findIndex((contact) => contact.id === id);
  
    if (index !== -1) {
      const updatedContact: Contact = {
        id,
        ...updatedContactData,
      };
  
      mockContacts[index] = updatedContact;
      return updatedContact;
    }
  
    return undefined;
  };

  export const deleteContact = (id: number): boolean => {
    const index = mockContacts.findIndex((contact) => contact.id === id);
  
    if (index !== -1) {
      mockContacts.splice(index, 1);
      return true;
    }
  
    return false;
  };
  

