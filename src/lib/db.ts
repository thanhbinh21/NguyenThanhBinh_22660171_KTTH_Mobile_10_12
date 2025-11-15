// lib/db.ts
import { openDatabaseAsync } from "expo-sqlite";

export const dbPromise = openDatabaseAsync("contacts.db");

export const getDB = async () => {
  return await dbPromise;
};

/**
 * INIT DB (TẠO BẢNG + SEED DỮ LIỆU MẪU)
 */
export const initDB = async () => {
  const db = await getDB();

  // 1) Tạo bảng nếu chưa có
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      favorite INTEGER DEFAULT 0,
      created_at INTEGER
    );
  `);

  // 2) Kiểm tra bảng có dữ liệu chưa
  const row = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM contacts"
  );

  // Nếu chưa có → seed 3 contact mẫu
  if (row?.total === 0) {
    await db.execAsync(`
      INSERT INTO contacts (name, phone, email, created_at)
      VALUES 
      ('Nguyễn Văn A', '0912345678', 'a@example.com', ${Date.now()}),
      ('Trần Thị B', '0987654321', 'b@example.com', ${Date.now()}),
      ('Lê Văn C', '0901234567', 'c@example.com', ${Date.now()});
    `);
  }

  console.log("DB initialized + seed OK");
};

/**
 * INSERT CONTACT MỚI
 */
export const insertContact = async (contact: {
  name: string;
  phone: string;
  email: string;
}) => {
  const db = await getDB();
  const result = await db.runAsync(
    "INSERT INTO contacts (name, phone, email, created_at) VALUES (?, ?, ?, ?)",
    [contact.name, contact.phone, contact.email, Date.now()]
  );
  return result.lastInsertRowId;
};

/**
 * TOGGLE FAVORITE (0 ↔ 1)
 */
export const toggleFavorite = async (id: number) => {
  const db = await getDB();
  // Lấy giá trị favorite hiện tại
  const contact = await db.getFirstAsync<{ favorite: number }>(
    "SELECT favorite FROM contacts WHERE id = ?",
    [id]
  );
  
  // Toggle: nếu là 1 thì thành 0, nếu là 0 thì thành 1
  const newFavorite = contact?.favorite === 1 ? 0 : 1;
  
  // Update trong database
  await db.runAsync(
    "UPDATE contacts SET favorite = ? WHERE id = ?",
    [newFavorite, id]
  );
  
  return newFavorite;
};

/**
 * UPDATE CONTACT (SỬA THÔNG TIN)
 */
export const updateContact = async (
  id: number,
  contact: {
    name: string;
    phone: string;
    email: string;
  }
) => {
  const db = await getDB();
  await db.runAsync(
    "UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?",
    [contact.name, contact.phone, contact.email, id]
  );
};

/**
 * DELETE CONTACT (XÓA LIÊN HỆ)
 */
export const deleteContact = async (id: number) => {
  const db = await getDB();
  await db.runAsync("DELETE FROM contacts WHERE id = ?", [id]);
};

/**
 * IMPORT CONTACTS FROM API (BATCH INSERT, BỎ QUA TRÙNG SỐ ĐIỆN THOẠI)
 */
export const importContactsFromAPI = async (contacts: Array<{
  name: string;
  phone: string;
  email: string;
}>) => {
  const db = await getDB();
  let importedCount = 0;
  let skippedCount = 0;

  for (const contact of contacts) {
    // Kiểm tra phone đã tồn tại chưa
    const existing = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM contacts WHERE phone = ?",
      [contact.phone]
    );

    if (!existing && contact.phone) {
      // Nếu chưa tồn tại và có phone → insert
      await db.runAsync(
        "INSERT INTO contacts (name, phone, email, created_at) VALUES (?, ?, ?, ?)",
        [contact.name, contact.phone, contact.email, Date.now()]
      );
      importedCount++;
    } else {
      // Nếu đã tồn tại hoặc không có phone → bỏ qua
      skippedCount++;
    }
  }

  return { importedCount, skippedCount };
};
