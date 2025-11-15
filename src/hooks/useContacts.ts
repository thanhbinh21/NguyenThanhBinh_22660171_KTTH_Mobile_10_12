// hooks/useContacts.ts
import { useState } from "react";
import { getDB, insertContact } from "../lib/db";

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

  return {
    contacts,
    loadContacts,
    addContact,
  };
};
