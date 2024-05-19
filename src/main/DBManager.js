/* eslint-disable prettier/prettier */
import Database from 'better-sqlite3';
import path from 'path';

const getDbPath = () => {
  return process.env.NODE_ENV === 'development'
    ? './database.db'
    : path.join(process.resourcesPath, './database.db');
};

const db = new Database(getDbPath(), { verbose: console.log });
db.pragma('journal_mode = WAL');

const createTables = [
  `
    CREATE TABLE IF NOT EXISTS "kisiler" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "ad" TEXT,
      "soyad" TEXT,
      "cinsiyet" TEXT,
      "kurum" TEXT,
      "telefon" TEXT
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS "randevular" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "ad" TEXT,
      "soyad" TEXT,
      "cinsiyet" TEXT,
      "kurum" TEXT,
      "telefon" TEXT,
      "talep_tarihi" TEXT,
      "randevu_tarihi" TEXT,
      "randevu_konusu" TEXT,
      "aciklama" TEXT
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS "ayarlar" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "ayar_adi" TEXT UNIQUE,
      "deger" TEXT
    )
  `
];

createTables.forEach((table) => db.exec(table));

export default db;
