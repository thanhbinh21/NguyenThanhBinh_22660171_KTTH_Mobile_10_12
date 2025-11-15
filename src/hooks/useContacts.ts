// hooks/useContacts.ts
import { useState, useCallback } from "react";
import { getDB, insertContact, toggleFavorite as dbToggleFavorite, updateContact as dbUpdateContact, deleteContact as dbDeleteContact, importContactsFromAPI as dbImportContactsFromAPI } from "../lib/db";

/**
 * Custom hook quản lý tất cả operations của contacts
 * Bao gồm: load, insert, update, delete, search, import
 */
export const useContacts = () => {
  const [contacts, setContacts] = useState([]);

  // Load contacts từ database - wrapped với useCallback
  const loadContacts = useCallback(async () => {
    const db = await getDB();
    const rows = await db.getAllAsync("SELECT * FROM contacts ORDER BY name ASC");
    setContacts(rows);
  }, []);

  // Thêm contact mới - wrapped với useCallback
  const addContact = useCallback(async (contact: {
    name: string;
    phone: string;
    email: string;
  }) => {
    await insertContact(contact);
    await loadContacts(); // Refresh danh sách
  }, [loadContacts]);

  // Toggle favorite status - wrapped với useCallback
  const toggleFavorite = useCallback(async (id: number) => {
    await dbToggleFavorite(id);
    await loadContacts(); // Refresh danh sách
  }, [loadContacts]);

  // Update contact - wrapped với useCallback
  const updateContact = useCallback(async (
    id: number,
    contact: {
      name: string;
      phone: string;
      email: string;
    }
  ) => {
    await dbUpdateContact(id, contact);
    await loadContacts(); // Refresh danh sách
  }, [loadContacts]);

  // Delete contact - wrapped với useCallback
  const deleteContact = useCallback(async (id: number) => {
    await dbDeleteContact(id);
    await loadContacts(); // Refresh danh sách
  }, [loadContacts]);

  // Import từ API - wrapped với useCallback
  const importFromAPI = useCallback(async (apiUrl: string) => {
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
  }, [loadContacts]);

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
