// src/pages/EditContact.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Contact, readContact, editContact } from '../data';
import './styles.css';
import { useContactsContext } from '../ContactsContext';

const EditContact: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const contactId = Number(id);

  const { contacts, setContacts } = useContactsContext();

  const [formData, setFormData] = useState<Contact | null>(null);

  useEffect(() => {
    
    const contact = readContact(contactId);
    if (contact) {
      setFormData(contact);
    } else {
      setFormData(null); 
    }
  }, [contactId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData: Contact | null) => {
      if (prevFormData) {
        return { ...prevFormData, [name]: value };
      }
      return null; // Handle the case when formData is null
    });
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (formData) {
      editContact(formData.id, formData);

      const updatedContacts = contacts.map((contact) =>
        contact.id === formData.id ? formData : contact
      );
      setContacts(updatedContacts);

      navigate(`/contacts/${formData.id}`);
    }
  };

  return (
    <div className="edit-contact-form">
      <h2>Edit Contact</h2>
      {formData ? (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </label>
          <label>
            Website:
            <input type="text" name="website" value={formData.website || ''} onChange={handleInputChange} />
          </label>
          <label>
            Twitter:
            <input type="text" name="twitter" value={formData.twitter || ''} onChange={handleInputChange} />
          </label>
          <button type="submit">Save Changes</button>
          <Link to={`/contacts/${formData.id}`} className="cancel-link">
            Cancel
          </Link>
        </form>
      ) : (
        <p>Contact not found.</p>
      )}
    </div>
  );
};

export default EditContact;
