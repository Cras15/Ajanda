/* eslint-disable prettier/prettier */
import db from './DBManager';

const formatDate = (date) => {
    const pad = (num) => (num < 10 ? '0' : '') + num;
    return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds());
};

const executeTransaction = (query, params) => {
    try {
        const preparedQuery = db.prepare(query);
        const transaction = db.transaction(() => {
            const info = preparedQuery.run(...params);
            console.log(`${info.changes} veri işlendi ve son ID: ${info.lastInsertRowid}`);
            return info;
        });
        return transaction();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const readAllPerson = () => {
    try {
        const query = `SELECT * FROM kisiler`;
        return db.prepare(query).all();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const readAllDate = () => {
    try {
        const query = `SELECT * FROM randevular`;
        return db.prepare(query).all();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const readAllSettings = () => {
    try {
        const query = `SELECT * FROM ayarlar`;
        return db.prepare(query).all();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const readSetting = (ayar_adi) => {
    try {
        const query = `SELECT * FROM ayarlar Where ayar_adi = ?`;
        return db.prepare(query).all(ayar_adi);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const readUpcomingDateWithinHours = (hours) => {
    try {
        const now = new Date();
        const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
        const nowFormatted = formatDate(now);
        const futureFormatted = formatDate(futureTime);

        const query = `SELECT * FROM randevular WHERE randevu_tarihi BETWEEN ? AND ? ORDER BY randevu_tarihi ASC`;
        return db.prepare(query).all(nowFormatted, futureFormatted);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const countUpcomingDateWithinHours = (hours) => {
    try {
        const now = new Date();
        const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
        const nowFormatted = formatDate(now);
        const futureFormatted = formatDate(futureTime);

        const query = `SELECT COUNT(*) as count FROM randevular WHERE randevu_tarihi BETWEEN ? AND ?`;
        const result = db.prepare(query).get(nowFormatted, futureFormatted);

        return result.count;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const insertPerson = (name, surname, gender, phone, business) => {
    const query = `INSERT INTO kisiler (ad, soyad, cinsiyet, telefon, kurum) VALUES (?, ?, ?, ?, ?)`;
    executeTransaction(query, [name, surname, gender, phone, business]);
};

const insertDate = (name, surname, gender, phone, date, requestDate, subject, business, institution) => {
    const query = `INSERT INTO randevular (ad, soyad, cinsiyet, kurum, telefon, talep_tarihi, randevu_tarihi, randevu_konusu, aciklama) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    executeTransaction(query, [name, surname, gender, business, phone, requestDate, date, subject, institution]);
};

const updateDate = (id, name, surname, gender, business, phone, date, requestDate, subject, institution) => {
    const query = `UPDATE randevular 
                    SET ad = ?, soyad = ?, cinsiyet = ?, kurum = ?, telefon = ?, talep_tarihi = ?, randevu_tarihi = ?, randevu_konusu = ?, aciklama = ?
                    WHERE id = ?`;
    executeTransaction(query, [name, surname, gender, business, phone, requestDate, date, subject, institution, id]);
};

const updateSettings = (ayar_adi, deger) => {
    try {
        const query = `
            INSERT INTO ayarlar (ayar_adi, deger)
            VALUES (?, ?)
            ON CONFLICT(ayar_adi) DO UPDATE SET
                deger = excluded.deger
        `;

        const upsertQuery = db.prepare(query);
        upsertQuery.run(ayar_adi, deger);
        console.log("Ayar eklendi veya güncellendi.");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const updateSettingsWithJson = (settings) => {
    try {
        const query = `
            INSERT INTO ayarlar (ayar_adi, deger)
            VALUES (?, ?)
            ON CONFLICT(ayar_adi) DO UPDATE SET
                deger = excluded.deger
        `;

        const upsertQuery = db.prepare(query);

        const transaction = db.transaction(() => {
            for (const [key, value] of Object.entries(settings)) {
                upsertQuery.run(key, value);
                console.log(`Ayar ${key} eklendi veya güncellendi.`);
            }
        });

        transaction();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const deleteDate = (id) => {
    const query = `DELETE FROM randevular WHERE id = ?`;
    executeTransaction(query, [id]);
};

const deletePerson = (id) => {
    const query = `DELETE FROM kisiler WHERE id = ?`;
    executeTransaction(query, [id]);
};

export {
    countUpcomingDateWithinHours,
    deleteDate,
    deletePerson,
    insertDate,
    insertPerson,
    readAllDate,
    readAllPerson, readAllSettings,
    readSetting, readUpcomingDateWithinHours,
    updateDate,
    updateSettings,
    updateSettingsWithJson
};

