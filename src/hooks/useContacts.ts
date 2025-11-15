// hooks/useContacts.ts
import { useState } from "react";
import { getDB, insertContact, toggleFavorite as dbToggleFavorite, updateContact as dbUpdateContact } from "../lib/db";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {
    const db = await getDB();
    const rows = await db.getAllAsync("SELECT * FROM contacts ORDER BY name ASC");
    setContacts(rows);
  };

  const addContact = async (contact: {
    name: string;
    phone: string;
    email: string;
  }) => {
    await insertContact(contact);
    await loadContacts(); // Refresh danh sách
  };

  const toggleFavorite = async (id: number) => {
    await dbToggleFavorite(id);
    await loadContacts(); // Refresh danh sách
  };

  const updateContact = async (
    id: number,
    contact: {
      name: string;
      phone: string;
      email: string;
    }
  ) => {
    await dbUpdateContact(id, contact);
    await loadContacts(); // Refresh danh sách
  };

  return {
    contacts,
    loadContacts,
    addContact,
    toggleFavorite,
    updateContact,
  };
};
