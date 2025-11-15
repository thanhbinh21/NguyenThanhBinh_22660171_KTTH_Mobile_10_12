// hooks/useContacts.ts
import { useState } from "react";
import { getDB, insertContact, toggleFavorite as dbToggleFavorite, updateContact as dbUpdateContact, deleteContact as dbDeleteContact, importContactsFromAPI as dbImportContactsFromAPI } from "../lib/db";

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

  const deleteContact = async (id: number) => {
    await dbDeleteContact(id);
    await loadContacts(); // Refresh danh sách
  };

  const importFromAPI = async (apiUrl: string) => {
    try {
      // Fetch data từ API
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Map dữ liệu từ API format sang local format
      const contactsToImport = data.map((item: any) => ({
        name: item.name || "Unknown",
        phone: item.phone || "",
        email: item.email || "",
      }));

      // Import vào database (bỏ qua trùng phone)
      const result = await dbImportContactsFromAPI(contactsToImport);
      
      // Refresh danh sách
      await loadContacts();
      
      return result;
    } catch (error) {
      console.error("Import error:", error);
      throw error;
    }
  };

  return {
    contacts,
    loadContacts,
    addContact,
    toggleFavorite,
    updateContact,
    deleteContact,
    importFromAPI,
  };
};
