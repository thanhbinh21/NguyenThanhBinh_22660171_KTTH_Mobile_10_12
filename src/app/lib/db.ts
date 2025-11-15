// lib/db.ts
import { openDatabaseAsync } from "expo-sqlite";

// Trả về Promise database (web + mobile đều chạy)
export const dbPromise = openDatabaseAsync("contacts.db");

// Hàm tiện dụng dùng khi cần mở DB
export const getDB = async () => {
  const db = await dbPromise;
  return db;
};
