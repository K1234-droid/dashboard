import { setItem, getItems, savePrompt as savePromptToDB, getAllPromptMetadata as getAllPromptMetadataFromDB, getPromptBlob as getPromptBlobFromDB, deletePromptFromDB, getFullPrompt as getFullPromptFromDB } from './db.js';

/**
 * Menyimpan sebuah pengaturan ke IndexedDB.
 * @param {string} key - Kunci pengaturan (e.g., 'username').
 * @param {any} value - Nilai pengaturan.
 * @returns {Promise<void>}
 */
export async function saveSetting(key, value) {
    return setItem(key, value);
}

/**
 * Memuat beberapa pengaturan dari IndexedDB.
 * @param {string[]} keys - Array kunci pengaturan yang ingin dimuat.
 * @returns {Promise<Object>} Sebuah promise yang resolve dengan objek pengaturan.
 */
export async function loadSettings(keys) {
    return getItems(keys);
}

export async function savePrompt(promptData) {
    return savePromptToDB(promptData);
}

export async function getAllPromptMetadata() {
    return getAllPromptMetadataFromDB();
}

export async function getPromptBlob(promptId, blobType) {
    return getPromptBlobFromDB(promptId, blobType);
}

export async function deletePromptDB(promptId) {
    return deletePromptFromDB(promptId); 
}

export async function getFullPrompt(promptId) {
    return getFullPromptFromDB(promptId);
}

/**
 * Alias untuk loadSettings untuk kompatibilitas dengan impor di file lain.
 * @param {string[]} keys - Array dari kunci pengaturan yang ingin diambil.
 * @returns {Promise<Object>} Sebuah promise yang resolve dengan objek pengaturan.
 */
export async function getAllSettings(keys) {
    return loadSettings(keys);
}

/**
 * Menghapus semua prompt dari IndexedDB.
 * @returns {Promise<void>}
 */
export async function deleteAllPrompts() {
    try {
        const allMetadata = await getAllPromptMetadata();
        const deletePromises = allMetadata.map(meta => deletePromptDB(meta.id));
        await Promise.all(deletePromises);
        console.log('Semua data prompt berhasil dihapus dari IndexedDB.');
    } catch (error) {
        console.error('Gagal menghapus semua data prompt:', error);
        throw error;
    }
}