import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Contact, readContact, deleteContact } from '../data';
import './styles.css';

const ContactDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const contactId = Number(id);

  const contact = readContact(contactId);
  const handleDelete = () => {
    deleteContact(contactId);
    navigate(-1);
  };

  return (
    <div className="contact-details">
      {contact ? (
        <>
          <h2>{contact.name}</h2>
          <p>Phone: {contact.phoneNumber}</p>
          <p>Email: {contact.email}</p>
          {contact.website && <p>Website: {contact.website}</p>}
          {contact.twitter && <p>Twitter: {contact.twitter}</p>}
          <Link to={`/edit/${contact.id}`} className="edit-link">
            Edit
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </>
      ) : (
        <p>Contact not found.</p>
      )}
    </div>
  );
};

export default ContactDetails;
