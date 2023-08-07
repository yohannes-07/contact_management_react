import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewContact, Contact } from '../data';
import './styles.css';


const AddContact: React.FC = () => {

  const navigate = useNavigate();
  const initialData:Contact = {
    name: '',
    phoneNumber: '',
    email: '',
    website: '',
    twitter: '',
  }

  const [formData, setFormData] = useState<Contact>(initialData);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newContact: Contact = {
      ...formData,
      id: Date.now(), 
    };
    createNewContact(newContact);
     navigate(-1);
  };

  return (
    <div className="add-contact-form">
      <h2>Add New Contact</h2>
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
          <input type="text" name="website" value={formData.website} onChange={handleInputChange} />
        </label>
        <label>
          Twitter:
          <input type="text" name="twitter" value={formData.twitter} onChange={handleInputChange} />
        </label>
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
};

export default AddContact;
