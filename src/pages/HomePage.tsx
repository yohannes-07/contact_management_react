import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContactsContext } from '../ContactsContext';
import { Contact, readContacts } from '../data';
import './styles.css';

const HomePage: React.FC = () => {
  const { contacts, setContacts } = useContactsContext();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    setTimeout(() => {
      const fetchedContacts = readContacts();
      setContacts(fetchedContacts);
    }, 1000);
  };

  return (
    <div className='body'>
      <h1>Contacts List</h1>
      {contacts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Link to={`/contacts/${contact.id}`} className='link-item'>
                {contact.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to='/add' className='add-link'>
        Add New Contact
      </Link>
    </div>
  );
};

export default HomePage;
